import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface Tool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      this.logger.warn('OPENROUTER_API_KEY not found in environment variables');
    }

    // OpenRouter использует OpenAI-совместимый API
    this.client = new OpenAI({
      apiKey: apiKey || 'dummy-key',
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer':
          this.configService.get<string>('CLIENT_URL') ||
          'http://localhost:3000',
        'X-Title': 'Shop AI Assistant',
      },
    });
  }

  async *streamChatCompletion(
    messages: ChatMessage[],
    tools?: Tool[],
    abortSignal?: AbortSignal,
  ): AsyncGenerator<{ type: 'content' | 'tool_calls'; data: any }> {
    try {
      const model =
        this.configService.get<string>('OPENROUTER_MODEL') ||
        'meta-llama/llama-3.3-70b-instruct:free';

      this.logger.log(`streamChatCompletion: ${messages}, \ntools - ${tools}`);

      const requestParams: OpenAI.Chat.ChatCompletionCreateParamsStreaming = {
        model: model,
        messages: messages as any,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      };

      if (tools && tools.length > 0) {
        (requestParams as any).tools = tools;
        (requestParams as any).tool_choice = 'auto';
      }

      const stream = await this.client.chat.completions.create(
        requestParams,
        {
          signal: abortSignal,
        },
      );

      let currentToolCalls: any[] = [];

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        if (delta?.content) {
          yield { type: 'content', data: delta.content };
        }

        if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            const index = toolCall.index;
            if (!currentToolCalls[index]) {
              currentToolCalls[index] = {
                id: toolCall.id || '',
                type: 'function',
                function: {
                  name: toolCall.function?.name || '',
                  arguments: '',
                },
              };
            }

            if (toolCall.function?.arguments) {
              currentToolCalls[index].function.arguments +=
                toolCall.function.arguments;
            }
          }
        }

        if (chunk.choices[0]?.finish_reason === 'tool_calls') {
          yield { type: 'tool_calls', data: currentToolCalls };
        }
      }

      this.logger.log('Stream completed');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.log('Stream aborted by user');
        return;
      }
      this.logger.error('Error in OpenRouter stream:', error);
      throw error;
    }
  }

  async getChatCompletion(messages: ChatMessage[]): Promise<string> {
    try {
      const model =
        this.configService.get<string>('OPENROUTER_MODEL') ||
        'meta-llama/llama-3.1-8b-instruct:free';

      const response = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('Error in OpenRouter completion:', error);
      throw error;
    }
  }
}
