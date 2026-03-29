// src/ai-agent/ai-agent.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChatRole } from '@prisma/client';
import { GrokClientService } from './grok-client.service';
import { PromptBuilderService } from './prompt-builder.service';
import { ProductSearchTool } from './tools/product-search.tool';
import { StreamCallbacks } from './interfaces/agent.interfaces';
import OpenAI from 'openai';
import { PrismaService } from 'src/prisma.service';
import { AiClientService } from './ai-client.service';

interface ActiveStream {
  abortController: AbortController;
}

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  private readonly activeStreams = new Map<string, ActiveStream>();
  private readonly socketSessionMap = new Map<string, string>();

  constructor(
    private readonly prisma: PrismaService,
    // private readonly grok: GrokClientService,
    private readonly grok: AiClientService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly productSearchTool: ProductSearchTool,
  ) {}

  // ── Session ───────────────────────────────────────────────────────────

  async getOrCreateSession(
    userId: string,
    sessionId?: string,
  ): Promise<string> {
    if (sessionId) {
      const existing = await this.prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (existing) return existing.id;
    }

    const session = await this.prisma.chatSession.create({
      data: { userId },
    });

    this.logger.log(`New session ${session.id} for user ${userId}`);
    return session.id;
  }

  registerSocket(socketId: string, sessionId: string): void {
    this.socketSessionMap.set(socketId, sessionId);
  }

  handleDisconnect(socketId: string): void {
    const sessionId = this.socketSessionMap.get(socketId);
    if (sessionId) {
      this.stopGeneration(sessionId);
      this.socketSessionMap.delete(socketId);
    }
  }

  // ── Main Agent Loop ───────────────────────────────────────────────────

  async streamAgentResponse(
    sessionId: string,
    userId: string, // ← передаётся из gateway: client.data.userId
    userMessage: string,
    callbacks: StreamCallbacks,
  ): Promise<void> {
    // Загружаем сессию — проверяем что она принадлежит этому userId
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20,
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // Сохраняем сообщение пользователя
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: ChatRole.user,
        content: userMessage,
      },
    });

    // Формируем историю для Grok из БД
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      ...session.messages.map((msg): OpenAI.ChatCompletionMessageParam => {
        if (msg.role === ChatRole.tool) {
          return {
            role: 'tool',
            content: msg.content,
            tool_call_id: (msg.toolCalls as any)?.[0]?.id ?? 'unknown',
          };
        }
        if (msg.role === ChatRole.assistant && msg.toolCalls) {
          return {
            role: 'assistant',
            content: msg.content || null,
            tool_calls: msg.toolCalls as any,
          };
        }
        return {
          role: msg.role === ChatRole.user ? 'user' : 'assistant',
          content: msg.content,
        };
      }),
      { role: 'user', content: userMessage },
    ];

    const abortController = new AbortController();
    this.activeStreams.set(sessionId, { abortController });

    const systemPrompt = this.promptBuilder.buildSystemPrompt();

    const tools: OpenAI.ChatCompletionTool[] = [
      {
        type: 'function',
        function:
          ProductSearchTool.getDefinition() as OpenAI.FunctionDefinition,
      },
    ];

    let fullAssistantText = '';
    let wasStopped = false;

    try {
      // ── Agentic loop (макс 5 итераций) ───────────────────────────────
      for (let iteration = 0; iteration < 5; iteration++) {
        this.logger.debug(`Agent iteration ${iteration + 1} [${sessionId}]`);

        if (abortController.signal.aborted) {
          wasStopped = true;
          break;
        }

        const stream = await this.grok.openai.chat.completions.create(
          {
            model: this.grok.modelName, // ← исправлено: modelName (public)
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            tools,
            tool_choice: 'auto',
            stream: true,
            max_tokens: 1024,
            temperature: 0.7,
          },
          { signal: abortController.signal },
        );

        let iterationText = '';
        const pendingToolCalls = new Map<
          number,
          { id: string; name: string; argumentsRaw: string }
        >();
        let finishReason: string | null = null;

        for await (const chunk of stream) {
          if (abortController.signal.aborted) {
            wasStopped = true;
            break;
          }

          const delta = chunk.choices[0]?.delta;
          finishReason = chunk.choices[0]?.finish_reason ?? finishReason;

          if (delta?.content) {
            iterationText += delta.content;
            fullAssistantText += delta.content;
            callbacks.onChunk(delta.content);
          }

          if (delta?.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!pendingToolCalls.has(idx)) {
                pendingToolCalls.set(idx, {
                  id: tc.id ?? `call_${Date.now()}_${idx}`,
                  name: tc.function?.name ?? '',
                  argumentsRaw: '',
                });
              }
              const entry = pendingToolCalls.get(idx)!;
              if (tc.function?.name) entry.name = tc.function.name;
              if (tc.function?.arguments)
                entry.argumentsRaw += tc.function.arguments;
            }
          }
        }

        if (wasStopped) break;

        // ── Tool calls ─────────────────────────────────────────────────
        if (pendingToolCalls.size > 0 && finishReason === 'tool_calls') {
          const toolCallsArr = Array.from(pendingToolCalls.values());

          const assistantMsg: OpenAI.ChatCompletionAssistantMessageParam = {
            role: 'assistant',
            content: iterationText || null,
            tool_calls: toolCallsArr.map((tc) => ({
              id: tc.id,
              type: 'function' as const,
              function: { name: tc.name, arguments: tc.argumentsRaw },
            })),
          };
          messages.push(assistantMsg);

          await this.prisma.chatMessage.create({
            data: {
              sessionId,
              role: ChatRole.assistant,
              content: iterationText || '',
              toolCalls: assistantMsg.tool_calls as any,
            },
          });

          for (const tc of toolCallsArr) {
            let toolResultContent: string;

            try {
              const args = JSON.parse(tc.argumentsRaw || '{}');
              this.logger.log(`Tool: ${tc.name}(${JSON.stringify(args)})`);
              callbacks.onToolCall(tc.name, args);

              if (tc.name === 'search_products') {
                const result = await this.productSearchTool.execute(args);
                toolResultContent = JSON.stringify(result);
              } else {
                toolResultContent = JSON.stringify({
                  error: `Unknown tool: ${tc.name}`,
                });
              }
            } catch (err: any) {
              this.logger.error(`Tool error: ${err.message}`);
              toolResultContent = JSON.stringify({
                error: String(err.message),
              });
            }

            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: toolResultContent,
            } as OpenAI.ChatCompletionToolMessageParam);

            await this.prisma.chatMessage.create({
              data: {
                sessionId,
                role: ChatRole.tool,
                content: toolResultContent,
                toolCalls: [{ id: tc.id }] as any,
              },
            });
          }

          continue;
        }

        break;
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || abortController.signal.aborted) {
        wasStopped = true;
      } else {
        this.logger.error(`Agent error [${sessionId}]: ${err.message}`);
        callbacks.onError(err as Error);
        return;
      }
    } finally {
      this.activeStreams.delete(sessionId);

      if (fullAssistantText) {
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            role: ChatRole.assistant,
            content: fullAssistantText,
            wasStopped,
          },
        });
      }

      wasStopped ? callbacks.onStopped() : callbacks.onDone();
    }
  }

  // ── Stop ──────────────────────────────────────────────────────────────

  stopGeneration(sessionId: string): void {
    const active = this.activeStreams.get(sessionId);
    if (active) {
      active.abortController.abort();
      this.logger.log(`Stopped [${sessionId}]`);
    }
  }

  // ── History ───────────────────────────────────────────────────────────

  async getSessionHistory(sessionId: string, userId: string) {
    return this.prisma.chatMessage.findMany({
      where: {
        sessionId,
        session: { userId },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        wasStopped: true,
        createdAt: true,
      },
    });
  }
}
