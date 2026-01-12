import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BrandDto } from './dto/brand.dto';
import { EnumRole, User } from '@prisma/client';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Injectable()
export class BrandService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
    private readonly cloudinaryFileService: CloudinaryFileService,
  ) {}

  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params ?? '',
    });
    const brands = await this.prisma.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...payload,
    });
    const totalCount = await this.prisma.brand.count({
      where: payload.where,
    });
    return { brands, totalCount };
  }

  async getByStoreId(storeId: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    return this.prisma.brand.findMany({
      where: { storeId: storeId },
    });
  }

  async getById(brandId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }
    return brand;
  }

  async create(userId: string, storeId: string, dto: BrandDto) {
    return this.prisma.brand.create({
      data: {
        name: dto.name,
        storeId,
        userId,
      },
    });
  }

  async update(user: User, id: string, dto: BrandDto) {
    await this.getById(id);
    return this.prisma.brand.update({
      where: {
        id,
        ...(user.role !== EnumRole.ADMIN &&
          user.role !== EnumRole.SUPER_ADMIN && { userId: user.id }),
      },
      data: dto,
    });
  }

  async delete(user: User, id: string) {
    const brand = await this.getById(id);
    await this.cloudinaryFileService.deleteManyFiles(brand.images);

    return this.prisma.brand.delete({
      where: {
        id,
        ...(user.role !== EnumRole.ADMIN && { userId: user.id }),
      },
    });
  }
}
