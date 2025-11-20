import { Injectable, NotFoundException } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove, pathExists } from 'fs-extra';
import { FileResponse } from './file.interface';
import * as pathLib from 'path';

@Injectable()
export class FileService {
  private readonly uploadRoot = `${path}/server-uploads`;

  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${this.uploadRoot}/${folder}`;

    await ensureDir(uploadedFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;

        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);

        return {
          url: `/server-uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );

    return response;
  }

  async deleteFile(fileUrl: string): Promise<{ success: boolean }> {
    try {
      const relativePath = fileUrl.replace('/server-uploads/', '');
      const fullPath = pathLib.join(this.uploadRoot, relativePath);

      const exists = await pathExists(fullPath);
      if (!exists) {
        throw new NotFoundException('File not found');
      }

      await remove(fullPath);
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Failed to delete file');
    }
  }
}
