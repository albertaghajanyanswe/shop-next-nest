import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    PrismaService,
    ProductService,
    StoreService,
    QueryPayloadBuilderService,
  ],
})
export class ReviewModule {}
