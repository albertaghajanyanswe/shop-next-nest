import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';
import { GetSubscriptionsDto } from 'src/subscription/dto/subscription.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
    private readonly cloudinaryFileService: CloudinaryFileService,
  ) {}

  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
    });
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: { ...payload.where, isPublished: true },
      // ...payload,
      include: {
        category: true,
        color: true,
        store: true,
        brand: true,
        reviews: true,
      },
    });
    const totalCount = await this.prisma.product.count({
      where: payload.where,
    });
    return { products, totalCount };
  }

  async getByStoreId(storeId: string, params?: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
      storeId,
    });

    const products = await this.prisma.product.findMany({
      ...payload,
      orderBy: [{ ...payload.orderBy }, { id: 'asc' }],
      include: {
        category: true,
        color: true,
        store: true,
        brand: true,
      },
    });

    const totalCount = await this.prisma.product.count({
      where: payload.where,
    });

    return { products, totalCount };
  }

  async getByIdHelper(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        category: true,
        color: true,
        brand: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async getById(id: string) {
    return await this.getByIdHelper(id);
  }

  async getProductById(id: string) {
    const product = await this.getByIdHelper(id);

    await this.prisma.product.update({
      where: { id },
      data: {
        totalViews: { increment: 1 },
      },
    });

    return product;
  }

  async getMostPopular(params?: string) {
    console.log('\n\n getMostPopular params = ', params);
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
    });
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      ...(payload.take ? { take: payload.take } : {}),
      ...(payload.skip ? { skip: payload.skip } : {}),
    });

    console.log(
      '\n\n mostPopularProducts.length = ',
      mostPopularProducts.length,
    );
    if (!mostPopularProducts.length) {
      return this.prisma.product.findMany({
        ...(payload.take ? { take: payload.take } : {}),
        ...(payload.skip ? { skip: payload.skip } : {}),
        orderBy: {
          totalViews: 'desc',
        },
        include: {
          category: true,
          brand: true,
          store: true,
        },
      });
    }
    const productIds = mostPopularProducts.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds as string[],
        },
      },
      include: {
        category: true,
        brand: true,
        store: true,
      },
      ...(payload.take ? { take: payload.take } : {}),
      ...(payload.skip ? { skip: payload.skip } : {}),
    });

    return products;
  }

  async getSimilar(id: string, params?: string) {
    const currentProduct = await this.getByIdHelper(id);
    if (!currentProduct) {
      throw new NotFoundException('Current product not found.');
    }

    const payload = this.queryBuilderService.build({
      queryParams: params || '',
    });
    const { where, ...rest } = payload;
    const similarProducts = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct?.category?.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
      ...rest,
    });

    return similarProducts;
  }

  async create(storeId: string, userId: string, dto: ProductDto) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        ...(dto?.colorId && { colorId: dto.colorId }),
        brandId: dto.brandId || '',
        storeId,
        userId,
        isOriginal: dto.isOriginal,
        isPublished: dto.isPublished,
        quantity: dto.quantity,
      },
    });
  }

  async update(id: string, dto: ProductDto) {
    const product = await this.getByIdHelper(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        images: dto.images,
        categoryId: dto.categoryId,
        ...(dto?.colorId && { colorId: dto.colorId }),
        brandId: dto.brandId,
        oldPrice: product.price,
        quantity: dto.quantity,
        isPublished: dto.isPublished,
        isOriginal: dto.isOriginal,
        // isBlocked: dto.isBlocked,
      },
    });
  }

  async delete(id: string) {
    const product = await this.getByIdHelper(id);
    await this.cloudinaryFileService.deleteManyFiles(product.images);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async enforceProductLimit(userId: string, subscription: GetSubscriptionsDto) {
    const limit = subscription?.productLimit || Infinity;

    if (limit === Infinity || limit === -1) {
      return;
    }

    const publishedProducts = await this.prisma.product.findMany({
      where: {
        userId,
        isPublished: true,
      },
      orderBy: [{ totalViews: 'desc' }, { createdAt: 'asc' }],
      select: {
        id: true,
      },
    });

    if (publishedProducts.length <= limit) {
      return;
    }

    const allowedIds = publishedProducts.slice(0, limit).map((p) => p.id);

    await this.prisma.product.updateMany({
      where: {
        userId,
        isPublished: true,
        id: {
          notIn: allowedIds,
        },
      },
      data: {
        isPublished: false,
      },
    });
  }
}
