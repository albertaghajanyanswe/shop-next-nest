// src/ai-agent/ai-agent.module.ts
import { Module } from '@nestjs/common';
import { AiAgentGateway } from './ai-agent.gateway';
import { AiAgentService } from './ai-agent.service';
// import { GrokClientService } from './grok-client.service';
import { PromptBuilderService } from './prompt-builder.service';
import { ProductSearchTool } from './tools/product-search.tool';
import { ProductModule } from 'src/product/product.module';
import { StoreModule } from 'src/store/store.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config';
import { AiClientService } from './ai-client.service';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [
    AiAgentGateway,
    AiAgentService,
    // GrokClientService,
    AiClientService,
    PromptBuilderService,
    ProductSearchTool,
    ConfigService,
    PrismaService
  ],
  exports: [AiAgentService],
})
export class AiAgentModule {}
