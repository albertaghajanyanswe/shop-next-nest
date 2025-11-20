import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubscriptionDto } from './dto/subscription.dto';
import {
  EnumOrderStatus,
  EnumSubscriptionType,
  type PaymentProvider,
  type Plan,
  type Subscription,
  type User,
} from '@prisma/client';
import { UpdateOrderDto } from './dto/update.order.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const subscriptions = await this.prisma.subscription.findMany();
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
    data: SubscriptionDto,
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
            ...data,
          },
        },
      },
      include: {
        subscription: true,
      },
    });
    const { subscription, ...rest } = order;
    return { order: rest, subscription };
  }

  async updateSubscriptionAndOrder(
    subscriptionDto: Partial<SubscriptionDto>,
    orderId: string,
    orderDto: Partial<UpdateOrderDto>,
  ) {
    const res = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...orderDto,
        subscription: {
          update: {
            ...subscriptionDto,
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
