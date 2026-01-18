import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    PrismaService,
    ProductService,
    QueryPayloadBuilderService,
    CloudinaryFileService,
  ],
})
export class SubscriptionModule {}
