import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiChatGateway } from './ai-chat.gateway';
import { AiChatService } from './ai-chat.service';
import { OpenRouterService } from './openrouter.service';
import { ProductSearchService } from './product-search.service';
import { PrismaService } from '../prisma.service';
import { EmbeddingService } from './embedding.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AiChatGateway,
    AiChatService,
    OpenRouterService,
    ProductSearchService,
    PrismaService,
    EmbeddingService,
  ],
  exports: [AiChatService],
})
export class AiChatModule {}
