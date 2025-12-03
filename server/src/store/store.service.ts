import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StoreDto } from './dto/store.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

@Injectable()
export class StoreService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
  ) {}

  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
    });
    const stores = await this.prisma.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...payload,
    });
    const totalCount = await this.prisma.store.count({
      where: payload.where,
    });
    return { stores, totalCount };
  }

  async getById(storeId: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!store) {
      throw new NotFoundException(
        'Store not found or you do not have access to it',
      );
    }
    return store;
  }

  async create(userId: string, dto: StoreDto) {
    if (dto.isDefaultStore) {
      const existingDefaultStore = await this.prisma.store.findFirst({
        where: { userId, isDefaultStore: true },
      });
      if (existingDefaultStore) {
        throw new BadRequestException('Default store already exists');
      }
    }
    return this.prisma.store.create({
      data: {
        title: dto.title,
        userId,
      },
    });
  }

  async update(storeId: string, userId: string, dto: StoreDto) {
    const store = await this.getById(storeId, userId);
    if (
      dto.isDefaultStore !== undefined &&
      dto.isDefaultStore !== store.isDefaultStore
    ) {
      throw new BadRequestException('Could not update default store');
    }
    return this.prisma.store.update({
      where: { id: store.id },
      data: {
        title: dto.title,
        description: dto.description,
        // isPublished: dto.isPublished,
        // isBlocked: dto.isBlocked,
      },
    });
  }

  async delete(storeId: string, userId: string) {
    const store = await this.getById(storeId, userId);

    if (store.isDefaultStore) {
      throw new BadRequestException('Could not delete default store');
    }
    return this.prisma.store.delete({
      where: { id: store.id },
    });
  }
}
