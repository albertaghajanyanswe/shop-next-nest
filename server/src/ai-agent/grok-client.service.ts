// src/ai-agent/grok-client.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * GrokClientService
 * xAI Grok совместим с OpenAI API — просто меняем baseURL.
 *
 * .env:
 *   XAI_API_KEY=xai-...
 *   XAI_BASE_URL=https://api.x.ai/v1
 *   XAI_MODEL=grok-3-fast
 */
@Injectable()
export class GrokClientService implements OnModuleInit {
  private readonly logger = new Logger(GrokClientService.name);
  private client!: OpenAI;

  // public — доступно из ai-agent.service.ts без ошибки TS2341
  public modelName!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.getOrThrow<string>('AI_API_KEY');
    const baseURL = this.config.get<string>(
      'AI_BASE_URL',
      'https://api.x.ai/v1',
    );
    this.modelName = this.config.get<string>('AI_MODEL', 'grok-3-fast');

    this.client = new OpenAI({ apiKey, baseURL });
    this.logger.log(`Grok ready — model: ${this.modelName}, url: ${baseURL}`);
  }

  get openai(): OpenAI {
    return this.client;
  }
}
