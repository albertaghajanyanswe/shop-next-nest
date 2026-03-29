// src/ai-agent/ai-agent.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiAgentService } from './ai-agent.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { WsCurrentUser } from 'src/auth/decorators/ws-current-user.decorator';
import type { User } from '@prisma/client';

/**
 * ═══════════════════════════════════════════════════════════════
 * WebSocket Protocol
 *
 * CLIENT → SERVER:
 *   chat:join     { storeSlug: string, sessionId?: string }
 *   chat:message  { sessionId: string, content: string }
 *   chat:stop     { sessionId: string }
 *
 * SERVER → CLIENT:
 *   chat:joined   { sessionId: string }
 *   chat:chunk    { chunk: string }          ← текстовый чанк (streaming)
 *   chat:tool     { tool: string, args: {} } ← агент вызывает инструмент
 *   chat:done     {}                         ← генерация завершена
 *   chat:stopped  {}                         ← остановлено пользователем
 *   chat:error    { message: string }        ← ошибка
 * ═══════════════════════════════════════════════════════════════
 */
@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: Function) => {
      // Разрешаем все origins в dev, в prod — настроить через env
      callback(null, true);
    },
    credentials: true,
  },
  namespace: '/chat',
  transports: ['websocket', 'polling'],
})
export class AiAgentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AiAgentGateway.name);

  // Маппинг socketId → sessionId для управления при дисконнекте
  private socketSessionMap = new Map<string, string>();

  constructor(
    private readonly agentService: AiAgentService,
    private readonly config: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Останавливаем генерацию если клиент отключился во время стриминга
    const sessionId = this.socketSessionMap.get(client.id);
    if (sessionId) {
      this.agentService.stopGeneration(sessionId);
      this.socketSessionMap.delete(client.id);
    }
  }

  // ── JOIN ─────────────────────────────────────────────────────────────
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chat:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User,
    @MessageBody() data: { sessionId?: string },
  ) {
    console.log('\n\n USER = ', user);
    if (!user) {
      client.emit('chat:error', { message: 'Not Authorized.' });
      return;
    }

    try {
      const sessionId = await this.agentService.getOrCreateSession(
        user.id,
        data.sessionId,
      );
      console.log('sessionId = ', sessionId);

      client.join(sessionId);
      this.socketSessionMap.set(client.id, sessionId);

      client.emit('chat:joined', { sessionId });
      this.logger.log(
        `Client ${client.id} joined session ${sessionId} (userId: ${user.id})`,
      );
    } catch (err: any) {
      this.logger.error(`Join error: ${err.message}`);
      client.emit('chat:error', { message: err.message });
    }
  }

  // ── MESSAGE ──────────────────────────────────────────────────────────
  @SubscribeMessage('chat:message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; content: string },
  ) {
    if (!data?.sessionId || !data?.content?.trim()) {
      client.emit('chat:error', {
        message: 'sessionId and content are required',
      });
      return;
    }

    const { sessionId, content } = data;
    this.logger.log(
      `Message [${sessionId}]: "${content.slice(0, 80)}${content.length > 80 ? '...' : ''}"`,
    );
    const userId = client.data.userId as string;

    await this.agentService.streamAgentResponse(sessionId, userId, content, {
      // Текстовый чанк → сразу в WebSocket
      onChunk: (chunk) => {
        client.emit('chat:chunk', { chunk });
      },

      // Агент вызывает инструмент → уведомляем фронт (можно показать "Ищу товары...")
      onToolCall: (tool, args) => {
        client.emit('chat:tool', { tool, args });
        this.logger.debug(`Tool call: ${tool}(${JSON.stringify(args)})`);
      },

      // Генерация завершена
      onDone: () => {
        client.emit('chat:done', {});
      },

      // Пользователь нажал Stop
      onStopped: () => {
        client.emit('chat:stopped', {});
      },

      // Ошибка в процессе генерации
      onError: (err) => {
        this.logger.error(`Stream error in session ${sessionId}:`, err);
        client.emit('chat:error', {
          message: 'Generation failed. Please try again.',
        });
      },
    });
  }

  // ── STOP ─────────────────────────────────────────────────────────────
  @SubscribeMessage('chat:stop')
  handleStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    if (!data?.sessionId) return;

    this.logger.log(`Stop requested for session ${data.sessionId}`);
    this.agentService.stopGeneration(data.sessionId);
  }
}
