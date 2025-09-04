import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

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

  async create(storeId: string, dto: CategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
        storeId,
      },
    });
  }

  async update(id: string, dto: CategoryDto) {
    await this.getById(id);
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
