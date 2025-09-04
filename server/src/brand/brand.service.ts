import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    return this.prisma.brand.findMany({
      where: { storeId: storeId },
      include: {
        category: true,
      },
    });
  }

  async getById(brandId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        category: true,
      },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }
    return brand;
  }

  async create(storeId: string, dto: BrandDto) {
    return this.prisma.brand.create({
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        storeId,
      },
    });
  }

  async update(id: string, dto: BrandDto) {
    await this.getById(id);
    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
