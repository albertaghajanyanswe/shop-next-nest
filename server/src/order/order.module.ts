import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

@Module({
  controllers: [OrderController],
  providers: [OrderService, QueryPayloadBuilderService, PrismaService],
})
export class OrderModule {}
