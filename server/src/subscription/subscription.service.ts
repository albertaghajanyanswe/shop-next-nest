import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetSubscriptionsDto } from './dto/subscription.dto';
import {
  EnumOrderStatus,
  EnumSubscriptionType,
  type PaymentProvider,
  type Plan,
  type Subscription,
  type User,
} from '@prisma/client';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ProductService } from 'src/product/product.service';
import { excludeFields } from 'src/utils/types/stripe';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  public async getAll(userId: string) {
    if (!userId) throw new UnauthorizedException();
    const model = this.prisma.subscription.fields;
    const select = excludeFields(model, ['stripeSubscriptionId', 'customerId']);
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId },
      select
    });
    return subscriptions;
  }

  async getById(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found.');
    }
    return subscription;
  }

  async createSubscriptionAndOrder(
    data: Partial<GetSubscriptionsDto>,
    user: User,
    plan: Plan,
    provider: PaymentProvider,
  ) {
    const order = await this.prisma.order.create({
      data: {
        totalPrice: plan.price,
        provider,
        status:
          plan.planId === EnumSubscriptionType.FREE
            ? EnumOrderStatus.SUCCEEDED
            : EnumOrderStatus.PENDING,
        user: {
          connect: { id: user.id },
        },
        subscription: {
          create: {
            ...(data as GetSubscriptionsDto),
          },
        },
      },
      include: {
        subscription: true,
      },
    });
    const { subscription, ...rest } = order;

    await this.productService.enforceProductLimit(
      user.id,
      subscription as GetSubscriptionsDto,
    );
    return { order: rest, subscription };
  }

  async updateSubscriptionAndOrder(
    getSubscriptionDto: Partial<GetSubscriptionsDto>,
    orderId: string,
    orderDto: Partial<UpdateOrderDto>,
  ) {
    const res = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...orderDto,
        subscription: {
          update: {
            ...getSubscriptionDto,
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    return res;
  }
}
