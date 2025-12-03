import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

@Module({
  controllers: [StoreController],
  providers: [StoreService, QueryPayloadBuilderService, PrismaService],
})
export class StoreModule {}
