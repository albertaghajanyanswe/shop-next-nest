import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

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
      ...payload,
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

    console.log('mostPopularProducts.length = ', mostPopularProducts.length);
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
        colorId: dto.colorId || '',
        brandId: dto.brandId || '',
        storeId,
        userId,
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
        colorId: dto.colorId,
        brandId: dto.brandId,
        oldPrice: product.price,
        // isPublished: dto.isPublished,
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
}
