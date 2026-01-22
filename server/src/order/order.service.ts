import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/order.dto';
import { EnumRole, PaymentProvider } from '@prisma/client';
import type { Prisma, User } from '@prisma/client';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { excludeFields } from 'src/utils/types/stripe';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
  ) {}

  excludeFieldsFromOrder = () => {
    const model = this.prisma.order.fields;
    return excludeFields(model, [
      'stripePaymentIntentId',
      'stripeChargeId',
      'providerMeta',
      'stripeSessionId',
    ]);
  };
  async getOrders(user: User, params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
      userId: user.id,
    });
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...payload,
      include: {
        user: true,
        orderItems: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
    const totalCount = await this.prisma.order.count({
      where: payload.where,
    });
    return { orders, totalCount };
  }

  async getAllOrders(user: User, params?: string) {
    try {
      if (!user || user.role !== EnumRole.SUPER_ADMIN) {
        throw new ForbiddenException(`Don't have enum permissions.`);
      }
      const payload = this.queryBuilderService.build({
        queryParams: params || '',
      });
      const { where, ...rest } = payload;

      const orders = await this.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          ...where,
          OR: [{ subscriptionId: null }, { subscriptionId: '' }],
        },
        ...rest,
        include: {
          user: true,
          orderItems: {
            include: {
              user: true,
            },
          },
        },
      });
      const totalCount = await this.prisma.order.count({
        where: {
          ...payload.where,
          OR: [{ subscriptionId: null }, { subscriptionId: '' }],
        },
      });
      return { orders, totalCount };
    } catch (err) {
      console.log('err = ', err);
    }
  }

  async getOrderItems(user: User, params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
      userId: user.id,
    });
    const orderItems = await this.prisma.orderItem.findMany({
      orderBy: { createdAt: 'desc' },
      ...payload,

      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        quantity: true,
        price: true,
        cachedProductTitle: true,
        cachedProductImages: true,
        productId: true,

        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const totalCount = await this.prisma.order.count({
      where: payload.where,
    });
    return { orderItems, totalCount };
  }

  async getSoldOrders(user: User, params?: string) {
    const payload = this.queryBuilderService.build({
      queryParams: params || '',
      // userId: user.id,
    });

    const where = {
      orderItems: {
        some: { product: { userId: user.id } },
      },
      ...payload.where,
    };

    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      where,
      include: {
        user: true, // покупатель
        orderItems: {
          include: {
            product: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          where: { userId: user.id },
        },
      },
    });

    const totalCount = await this.prisma.order.count({ where });

    return { orders, totalCount };
  }

  async getByIdHelper(user: User, id: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        user: true,
        orderItems: { include: { user: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async getById(user: User, id: string) {
    return await this.getByIdHelper(user, id);
  }

  async createOrder(dto: OrderDto, userId: string) {
    try {
      const orderItems: any = [];

      for (const item of dto.orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            title: true,
            images: true,
          },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }
        orderItems.push({
          quantity: item.quantity,
          price: item.price,
          cachedProductTitle: product.title,
          cachedProductImages: product.images,
          product: {
            connect: {
              id: item.productId,
            },
          },
          store: {
            connect: {
              id: item.storeId,
            },
          },
          user: {
            connect: {
              id: item.userId,
            },
          },
        });
      }

      const totalPrice = dto.orderItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      const order = await this.prisma.order.create({
        data: {
          status: dto.status,
          orderItems: {
            create: orderItems,
          },
          totalPrice,
          user: {
            connect: {
              id: userId,
            },
          },
          provider: PaymentProvider.STRIPE,
        },
      });

      return order;
    } catch (error) {
      console.log('error ', error);
    }
  }

  async createOrderWithTx(
    dto: OrderDto,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    const orderItems: any[] = [];

    for (const item of dto.orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: {
          title: true,
          images: true,
        },
      });

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      orderItems.push({
        quantity: item.quantity,
        price: item.price,
        cachedProductTitle: product.title,
        cachedProductImages: product.images,
        product: {
          connect: { id: item.productId },
        },
        store: {
          connect: { id: item.storeId },
        },
        user: {
          connect: { id: item.userId },
        },
      });
    }

    const totalPrice = dto.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return tx.order.create({
      data: {
        status: dto.status,
        totalPrice,
        provider: PaymentProvider.STRIPE,
        user: {
          connect: { id: userId },
        },
        orderItems: {
          create: orderItems,
        },
      },
    });
  }
}
