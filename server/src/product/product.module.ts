import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, StoreService, QueryPayloadBuilderService, PrismaService],
})
export class ProductModule {}
