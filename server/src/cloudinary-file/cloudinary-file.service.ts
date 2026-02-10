import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryFileService {
  private readonly logger = new Logger(CloudinaryFileService.name);

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<UploadApiResponse[]> {
    if (!files?.length) throw new BadRequestException('No files provided');

    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );

    return results as UploadApiResponse[];
  }

  async deleteFile(url: string): Promise<boolean> {
    // const url =
    //   'http://res.cloudinary.com/dvuo50sjj/image/upload/v1764672034/products/avvegssidk0vb7ewtxox.png';
    // const publicId = 'products/avvegssidk0vb7ewtxox';

    this.logger.log(`Attempting to delete file from Cloudinary: ${url}`);
    const afterUpload = url.split('/upload/')[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const publicId = withoutVersion.replace(/\.[^/.]+$/, '');

    this.logger.log(`Extracted publicId: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    return result.result === 'ok' || result.result === 'not found';
  }

  async deleteManyFiles(urls: string[]) {
    if (!urls?.length) return [];

    const deletePromises = urls.map((url) => this.deleteFile(url));

    const results = await Promise.allSettled(deletePromises);

    const output = results.map((res, index) => {
      if (res.status === 'rejected') {
        this.logger.error(
          `Cloudinary delete error for ${urls[index]}:`,
          res.reason?.message,
        );
        return { url: urls[index], success: false, error: res.reason };
      }
      return { url: urls[index], success: true };
    });

    return output;
  }
}
