import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  GetProductDto,
  GetProductWithDetails,
  GetProductWithDetailsAndCount,
  ProductDto,
} from './dto/product.dto';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';
import { GetSubscriptionsDto } from 'src/subscription/dto/subscription.dto';
import { EnumSubscriptionStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
    private readonly cloudinaryFileService: CloudinaryFileService,
  ) {}

  getDefaultWhere() {
    return {
      isPublished: true,
    };
  }
  async getAll(params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
    });
    const { where, ...rest } = payload;
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: { ...where, ...this.getDefaultWhere() },
      ...rest,
      include: {
        category: true,
        color: true,
        store: true,
        brand: true,
        reviews: true,
        user: true,
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });
    const productsWithSoldCount = this.getSoldCount(products);
    const totalCount = await this.prisma.product.count({
      where: { ...where, ...this.getDefaultWhere() },
    });
    return { products: productsWithSoldCount, totalCount };
  }

  async getByStoreId(storeId: string, params?: string) {
    if (!storeId) {
      this.logger.error('Store ID is required to fetch products by store.');
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
        user: true,
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const productsWithSoldCount = this.getSoldCount(products);
    const totalCount = await this.prisma.product.count({
      where: payload.where,
    });

    return { products: productsWithSoldCount, totalCount };
  }

  async getByIdHelper(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        productDetails: true,
        category: true,
        store: true,
        color: true,
        brand: true,
        reviews: {
          include: {
            user: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const productWithSoldCount = this.getSoldCount([
      product as unknown as GetProductWithDetails,
    ])[0];
    if (!productWithSoldCount) {
      this.logger.error(`Product with ID ${id} not found.`);
      throw new NotFoundException('Product not found.');
    }

    return productWithSoldCount;
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

    if (!mostPopularProducts.length) {
      const allProducts = this.prisma.product.findMany({
        ...(payload.take ? { take: payload.take } : {}),
        ...(payload.skip ? { skip: payload.skip } : {}),
        orderBy: {
          totalViews: 'desc',
        },
        include: {
          category: true,
          brand: true,
          store: true,
          orderItems: {
            select: {
              quantity: true,
            },
          },
        },
      });

      const productsWithSoldCount = this.getSoldCount(
        allProducts as unknown as GetProductWithDetails[],
      );
      return productsWithSoldCount;
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
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
      ...(payload.take ? { take: payload.take } : {}),
      ...(payload.skip ? { skip: payload.skip } : {}),
    });

    const productsWithSoldCount = this.getSoldCount(
      products as unknown as GetProductWithDetails[],
    );
    return productsWithSoldCount;
  }

  async getSimilar(id: string, params?: string) {
    const currentProduct = await this.getByIdHelper(id);
    if (!currentProduct) {
      this.logger.error(
        `Current product with ID ${id} not found for fetching similar products.`,
      );
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
        store: true,
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
      ...rest,
    });

    const similarProductsWithSoldCount = this.getSoldCount(
      similarProducts as unknown as GetProductWithDetails[],
    );
    return similarProductsWithSoldCount;
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
        intendedFor: dto.intendedFor,
        ...(dto.productDetails &&
          dto.productDetails.length > 0 && {
            productDetails: {
              create: dto.productDetails.map((detail) => ({
                key: detail.key,
                value: detail.value,
              })),
            },
          }),
      },
    });
  }

  async update(id: string, dto: ProductDto) {
    const product = await this.getByIdHelper(id);

    if (product.isPublished !== dto.isPublished && dto.isPublished === true) {
      const allProducts = await this.prisma.product.findMany({
        where: {
          userId: product.userId,
          isPublished: true,
        },
      });

      const userSubscription = await this.prisma.subscription.findFirst({
        where: {
          userId: product.userId as string,
          status: EnumSubscriptionStatus.ACTIVE,
        },
      });

      if ((userSubscription?.productLimit || 10) >= allProducts.length) {
        this.logger.error(
          `User ${product.userId} has reached the product limit for their subscription plan. Cannot publish more products.`,
        );
        throw new BadRequestException(
          'You have reached the limit of published products for your subscription plan.',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.productDetails) {
        const existingDetails = await tx.productDetail.findMany({
          where: { productId: id },
        });

        const incomingIds = dto.productDetails
          .filter((d) => d.id)
          .map((d) => d.id as string);

        const idsToDelete = existingDetails
          .filter((d) => !incomingIds.includes(d.id))
          .map((d) => d.id);

        if (idsToDelete.length) {
          await tx.productDetail.deleteMany({
            where: { id: { in: idsToDelete } },
          });
        }

        for (const detail of dto.productDetails) {
          if (detail.id) {
            await tx.productDetail.update({
              where: { id: detail.id },
              data: {
                key: detail.key,
                value: detail.value,
              },
            });
          } else {
            await tx.productDetail.create({
              data: {
                productId: id,
                key: detail.key,
                value: detail.value,
              },
            });
          }
        }
      }

      // ---- product
      return tx.product.update({
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
          intendedFor: dto.intendedFor,
        },
      });
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
        ...this.getDefaultWhere(),
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
        ...this.getDefaultWhere(),
        id: {
          notIn: allowedIds,
        },
      },
      data: {
        isPublished: false,
      },
    });
  }

  getSoldCount(products: GetProductWithDetails[]) {
    const productsWithSoldCount = products.map((product) => {
      const soldCount = product.orderItems?.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      return {
        ...product,
        soldCount,
      };
    });

    return productsWithSoldCount;
  }
}
