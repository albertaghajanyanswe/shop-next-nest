import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      return await this.getSearchTermFilter(searchTerm);
    }

    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        brand: true,
      },
    });
    return products;
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async getByStoreId(storeId: string) {
    if (!storeId) {
      throw new NotFoundException('Store ID is required.');
    }
    return this.prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        color: true,
        store: true,
        brand: true,
      },
    });
  }

  async getByIdHelper(id: string) {
    const product = await this.prisma.product.findUnique({
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

    console.log('\n\n product', product.totalViews);
    return product;
  }

  async getByCategoryId(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!products) {
      throw new NotFoundException('Products not found.');
    }

    return products;
  }

  async getMostPopular() {
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
    });
    console.log('\n\n mostPopularProducts', mostPopularProducts);
    if (!mostPopularProducts.length) {
      return this.prisma.product.findMany({
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
    });

    return products;
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getByIdHelper(id);
    if (!currentProduct) {
      throw new NotFoundException('Current product not found.');
    }
    const similarProducts = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct?.category?.title,
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
        colorId: dto.colorId,
        brandId: dto.brandId,
        storeId,
        userId,
      },
    });
  }

  async update(id: string, dto: ProductDto) {
    const product = await this.getByIdHelper(id);
    return this.prisma.product.update({
      where: { id },
      data: { ...dto, oldPrice: product.price },
    });
  }

  async delete(id: string) {
    await this.getByIdHelper(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
