import { Module } from '@nestjs/common';
import { CloudinaryFileService } from './cloudinary-file.service';
import { CloudinaryFileController } from './cloudinary-file.controller';

@Module({
  controllers: [CloudinaryFileController],
  providers: [CloudinaryFileService],
})
export class CloudinaryFileModule {}
