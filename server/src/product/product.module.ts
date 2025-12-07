import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    StoreService,
    CloudinaryFileService,
    QueryPayloadBuilderService,
    PrismaService,
  ],
})
export class ProductModule {}
