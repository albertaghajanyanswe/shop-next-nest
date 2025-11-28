import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto } from './dto/color.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

@Injectable()
export class ColorService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
  ) {}

  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params ?? '',
    });
    console.log('PAYLOAD = ', payload);
    const colors = await this.prisma.color.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...payload,
    });
    const totalCount = await this.prisma.color.count({
      where: payload.where,
    });
    return { colors, totalCount };
  }

  async getByStoreId(storeId: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    return this.prisma.color.findMany({
      where: { storeId: storeId },
    });
  }

  async getById(colorId: string) {
    const color = await this.prisma.color.findUnique({
      where: { id: colorId },
    });
    if (!color) {
      throw new NotFoundException('Color not found.');
    }
    return color;
  }

  async create(storeId: string, dto: ColorDto) {
    return this.prisma.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });
  }

  async update(id: string, dto: ColorDto) {
    await this.getById(id);
    return this.prisma.color.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prisma.color.delete({
      where: { id },
    });
  }
}
