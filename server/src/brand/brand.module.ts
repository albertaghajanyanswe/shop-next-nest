import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, StoreService, CloudinaryFileService, QueryPayloadBuilderService, PrismaService],
})
export class BrandModule {}
