import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { ChatQueryDto, AbortChatDto } from './dto/chat-message.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/api/ai-chat',
})
export class AiChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AiChatGateway.name);
  private activeStreams = new Map<string, AbortController>();

  constructor(private readonly aiChatService: AiChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Connected to AI Chat' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeStreams.forEach((controller) => {
      controller.abort();
    });
  }

  @SubscribeMessage('chat:query')
  async handleChatQuery(
    @MessageBody() data: ChatQueryDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { query, sessionId, messages = [] } = data;

    try {
      this.logger.log(
        `handleChatQuery: session - ${sessionId}: query - ${query.substring(0, 50)}...`,
      );

      // Create abort controller for this stream
      const abortController = new AbortController();
      this.activeStreams.set(sessionId, abortController);

      const context = {
        messages,
        sessionId,
      };

      // Stream the response
      for await (const chunk of this.aiChatService.processQuery(
        query,
        context,
        abortController.signal,
      )) {
        if (chunk.type === 'text') {
          client.emit('chat:stream', {
            sessionId,
            type: 'text',
            chunk: chunk.data,
            done: false,
          });
        } else if (chunk.type === 'product_card') {
          client.emit('chat:stream', {
            sessionId,
            type: 'product_card',
            data: chunk.data,
            done: false,
          });
        }
      }

      // Send completion signal
      client.emit('chat:stream', {
        sessionId,
        type: 'done',
        done: true,
      });

      // Clean up
      this.activeStreams.delete(sessionId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your request';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error handling chat query: ${errorMessage}`,
        errorStack,
      );

      client.emit('chat:error', {
        sessionId,
        error: errorMessage,
      });

      this.activeStreams.delete(sessionId);
    }
  }

  @SubscribeMessage('chat:abort')
  handleAbort(
    @MessageBody() data: AbortChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = data;

    this.logger.log(`Aborting stream for session: ${sessionId}`);

    const controller = this.activeStreams.get(sessionId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(sessionId);

      client.emit('chat:aborted', { sessionId });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong');
  }
}
