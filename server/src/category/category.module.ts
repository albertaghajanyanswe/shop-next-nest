import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, StoreService, QueryPayloadBuilderService, PrismaService],
})
export class CategoryModule {}
