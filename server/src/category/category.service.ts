import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { EnumRole, User } from '@prisma/client';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
    private readonly cloudinaryFileService: CloudinaryFileService,
  ) {}

  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params ?? '',
    });
    console.log('PAYLOAD = ', payload);
    const categories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...payload,
    });
    const totalCount = await this.prisma.category.count({
      where: payload.where,
    });
    return { categories, totalCount };
  }

  async getByStoreId(storeId: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    return this.prisma.category.findMany({
      where: { storeId: storeId },
    });
  }

  async getById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    return category;
  }

  async create(userId: string, storeId: string, dto: CategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
        storeId,
        userId,
      },
    });
  }

  async update(user: User, id: string, dto: CategoryDto) {
    await this.getById(id);
    return this.prisma.category.update({
      where: {
        id,
        ...(user.role !== EnumRole.ADMIN &&
          user.role !== EnumRole.SUPER_ADMIN && { userId: user.id }),
      },
      data: dto,
    });
  }

  async delete(user: User, id: string) {
    const cat = await this.getById(id);

    await this.cloudinaryFileService.deleteManyFiles(cat.images);

    return this.prisma.category.delete({
      where: {
        id,
        ...(user.role !== EnumRole.ADMIN &&
          user.role !== EnumRole.SUPER_ADMIN && { userId: user.id }),
      },
    });
  }
}
