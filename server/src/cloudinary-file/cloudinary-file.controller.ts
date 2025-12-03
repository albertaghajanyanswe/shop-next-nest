import {
  Controller,
  Post,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  Query,
  Body,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { CloudinaryFileService } from './cloudinary-file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

@Controller('cloudinary/files')
export class CloudinaryFileController {
  constructor(private readonly cloudinaryFileService: CloudinaryFileService) {}

  @Post()
  @Auth()
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder = 'products',
  ) {
    return this.cloudinaryFileService.uploadFiles(files, folder);
  }

  @Delete()
  @Auth()
  @HttpCode(200)
  async delete(@Body('url') url: string) {
    return this.cloudinaryFileService.deleteFile(url);
  }

  // --- PROXY ENDPOINT for LCP / Cloudinary transformations ---
  @Get('proxy')
  async proxyImage(@Req() req: Request, @Res() res: Response) {
    const { path, tr } = req.query as { path: string; tr?: string };

    if (!path) return res.status(400).send('Missing path parameter');

    const cloudinaryUrl = `https://res.cloudinary.com/dvuo50sjj/image/upload/${
      tr ? tr + '/' : ''
    }${path}`;

    const response = await fetch(cloudinaryUrl);
    const buffer = await response.arrayBuffer();

    res.setHeader(
      'Content-Type',
      response.headers.get('Content-Type') || 'image/png',
    );
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(buffer));
  }
}
