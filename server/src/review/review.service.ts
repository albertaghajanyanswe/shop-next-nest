import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ReviewDto } from './dto/review.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
  ) {}

  async getByStoreId(storeId: string, params?: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
      storeId,
    });

    const reviews = await this.prisma.review.findMany({
      ...payload,
      orderBy: [{ ...payload.orderBy }, { id: 'asc' }],
      include: {
        user: true,
      },
    });

    const totalCount = await this.prisma.review.count({
      where: payload.where,
    });
    return { reviews, totalCount };
  }

  async getById(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id, userId },
      include: {
        user: true,
      },
    });
    if (!review) {
      throw new NotFoundException(
        'Review not found or you don`t have a permissions',
      );
    }
    return review;
  }

  async create(
    dto: ReviewDto,
    userId: string,
    productId: string,
    storeId: string,
  ) {
    await this.productService.getByIdHelper(productId);

    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
