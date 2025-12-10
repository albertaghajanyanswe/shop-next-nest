import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { GetOrderItemDto, OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { EnumOrderStatus, EnumRole, PaymentProvider } from '@prisma/client';
import type { User } from '@prisma/client';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID'] as string,
  secretKey: process.env['YOOKASSA_SECRET_KEY'] as string,
});

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly queryBuilderService: QueryPayloadBuilderService,
  ) {}

  async getAll(user: User, params?: string) {
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
      const orders = await this.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        ...payload,
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
        where: payload.where,
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
        some: { product: { userId: user.id } }, // здесь обязательно наличие хотя бы одного товара пользователя
      },
      ...payload.where,
    };

    console.log('\n\n user = ', user.id);
    console.log('\n\n where = ', JSON.parse(JSON.stringify(where)));
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
        orderItems: true,
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

  async createPayment(dto: OrderDto, userId: string) {
    console.log('\n\n createPayment userId ', userId);
    console.log('createPayment dto ', dto);
    try {
      const orderItems = dto.orderItems.map((item) => ({
        quantity: item.quantity,
        price: item.price,
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
      }));

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

      const payment = await checkout.createPayment({
        amount: {
          value: totalPrice.toFixed(2),
          currency: 'RUB',
        },
        payment_method_data: {
          type: 'bank_card',
        },
        confirmation: {
          type: `redirect`,
          return_url: `${process.env.CLIENT_URL}/thanks`,
        },
        description: `Order purchase in the Your Store. Payment Id: #${order.id}`,
      });

      return payment;
    } catch (error) {
      console.log('error ', error);
    }
  }

  async updateStatus(dto: PaymentStatusDto) {
    if (dto.event === 'payment.waiting_for_capture') {
      const capturePayment: ICapturePayment = {
        amount: {
          value: dto.object.amount.value,
          currency: dto.object.amount.currency,
        },
      };

      return checkout.capturePayment(dto.object.id, capturePayment);
    }

    if (dto.event === 'payment.succeeded') {
      const orderId = dto.object.description.split('#')[1];
      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: EnumOrderStatus.SUCCEEDED,
        },
      });
      return true;
    }

    return true;
  }

  async pay(dto: OrderDto, userId: string) {
    console.log('\n\n createPayment userId ', userId);
    console.log('createPayment dto ', dto);
    try {
      const orderItems = dto.orderItems.map((item) => ({
        quantity: item.quantity,
        price: item.price,
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
      }));

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

      const payment = await checkout.createPayment({
        amount: {
          value: totalPrice.toFixed(2),
          currency: 'RUB',
        },
        payment_method_data: {
          type: 'bank_card',
        },
        confirmation: {
          type: `redirect`,
          return_url: `${process.env.CLIENT_URL}/thanks`,
        },
        description: `Order purchase in the Your Store. Payment Id: #${order.id}`,
      });

      return payment;
    } catch (error) {
      console.log('error ', error);
    }
  }

  async createOrder(dto: OrderDto, userId: string) {
    console.log('\n\n createPayment userId ', userId);
    console.log('createPayment dto ', dto);
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
        console.log('\n\n item = ', item);
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
}
