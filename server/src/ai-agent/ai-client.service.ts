// src/ai-agent/ai-client.service.ts
// Работает с любым OpenAI-совместимым провайдером:
//   Google Gemini, Groq, xAI Grok, OpenAI и др.
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiClientService implements OnModuleInit {
  private readonly logger = new Logger(AiClientService.name);
  private client!: OpenAI;
  public modelName!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.getOrThrow<string>('AI_API_KEY');
    const baseURL = this.config.getOrThrow<string>('AI_BASE_URL');
    this.modelName = this.config.getOrThrow<string>('AI_MODEL');

    this.client = new OpenAI({ apiKey, baseURL });
    this.logger.log(`AI client ready — model: ${this.modelName}`);
  }

  get openai(): OpenAI {
    return this.client;
  }
}
