import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InitSubscriptionPaymentRequest } from './dto';
import {
  BillingPeriod,
  CurrencyEnum,
  PaymentProvider,
  User,
} from '@prisma/client';
import { YoomoneyService } from './provider/yoomoney/yoomoney.service';
import { StripeService } from './provider/stripe/stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly yoomoneyService: YoomoneyService,
    private readonly stripeService: StripeService,
  ) {}

  public async getHistory(userId: string) {
    const payments = await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        orderItems: {},
      },
    });

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      totalPrice: payment.totalPrice,
      status: payment.status,
      createdAt: payment.createdAt,
      plan: payment.subscription?.plan,
      provider: payment.provider,
    }));

    return formattedPayments;
  }

  public async initSubscription(
    dto: InitSubscriptionPaymentRequest,
    user: User,
  ) {
    const { planId, provider } = dto;

    const plan = await this.prismaService.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const order = await this.prismaService.order.create({
      data: {
        totalPrice: plan.price,
        provider,
        billingPeriod: plan.period,
        user: {
          connect: {
            id: user.id,
          },
        },
        subscription: {
          connectOrCreate: {
            where: {
              userId: user.id,
            },
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              plan: {
                connect: {
                  id: plan.id,
                },
              },
              period: plan.period,
            },
          },
        },
      },
    });

    let payment;

    switch (provider) {
      case PaymentProvider.YOOKASSA:
        payment = this.yoomoneyService.upgradeSubscription(
          user,
          plan,
          order,
          plan.period,
        );
        break;
      case PaymentProvider.STRIPE:
        payment = this.stripeService.upgradeSubscription(
          user,
          plan,
          order,
          plan.period,
        );
        break;
      default:
        payment = this.stripeService.upgradeSubscription(
          user,
          plan,
          order,
          plan.period,
        );
    }

    await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: {
        providerMeta: payment,
      },
    });
    return order;
  }
}
