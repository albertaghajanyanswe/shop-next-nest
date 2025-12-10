import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InitSubscriptionPaymentRequest } from './dto';
import {
  BillingPeriod,
  CurrencyEnum,
  EnumRole,
  Order,
  PaymentProvider,
  User,
} from '@prisma/client';
import { YoomoneyService } from './provider/yoomoney/yoomoney.service';
import { StripeService } from './provider/stripe/stripe.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/utils/constants/variables';
import { OrderDto } from 'src/order/dto/order.dto';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly yoomoneyService: YoomoneyService,
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
    private configService: ConfigService,
  ) {}

  public async getOrders(userId: string) {
    const payments = await this.prismaService.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        orderItems: true,
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
      where: { planId: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // const order = await this.prismaService.order.create({
    //   data: {
    //     totalPrice: plan.price,
    //     provider,
    //     user: {
    //       connect: {
    //         id: user.id,
    //       },
    //     },
    //     // subscription: {
    //     //   create: {
    //     //     user: {
    //     //       connect: {
    //     //         id: user.id,
    //     //       },
    //     //     },
    //     //     plan: {
    //     //       connect: {
    //     //         id: plan.id,
    //     //       },
    //     //     },
    //     //     period: plan.period,
    //     //   },
    //     // },
    //   },
    // });

    let payment;

    switch (provider) {
      case PaymentProvider.YOOKASSA:
        payment = this.yoomoneyService.upgradeSubscription(user, plan);
        break;
      case PaymentProvider.STRIPE:
        payment = this.stripeService.upgradeSubscription(user, plan);
        break;
      default:
        payment = this.stripeService.upgradeSubscription(user, plan);
    }

    // await this.prismaService.order.update({
    //   where: {
    //     id: order.id,
    //   },
    //   data: {
    //     providerMeta: payment,
    //   },
    // });
    return payment;
  }

  public async cancelUpgrade(userId: string) {
    return this.stripeService.cancelUpgrade(userId);
  }

  public async getManagementLink(userId: string, res: any) {
    const customer = await this.prismaService.billingInfo.findUnique({
      where: { userId },
    });
    if (!customer) throw new BadRequestException('Customer not found');

    const portalSession = await this.stripeService
      .getStripe()
      .billingPortal.sessions.create({
        customer: customer.stripeCustomerId as string,
        return_url: `${this.configService.get<string>(EnvVariables.CLIENT_URL)}`,
      });
    return res.json({ url: portalSession.url });
  }

  public async getSubscriptions(userId: string) {
    if (!userId) throw new UnauthorizedException();
    const subscriptions = await this.prismaService.subscription.findMany({
      where: { userId },
    });
    return subscriptions;
  }

  public async getPlans(userId: string) {
    if (!userId) throw new UnauthorizedException();
    const plans = await this.stripeService.getAvailablePlans();
    return plans;
  }

  public async pay(dto: OrderDto, userId: string) {
    const order = await this.orderService.createOrder(dto, userId);
    return this.stripeService.pay(dto, userId, order as Order);
  }

  public async createConnectAccountStripe(user: User) {
    return this.stripeService.createConnectAccountStripe(user);
  }

  public async simulateStripeTestClockAdvance(
    userId: string,
    numberOfDays: number,
  ) {
    return this.stripeService.simulateStripeTestClockAdvance(
      userId,
      numberOfDays,
    );
  }

  public async createLoginLink(user: User) {
    return this.stripeService.createLoginLink(user);
  }

  public async orderPayToCustomer(user: User, orderId: string) {
    if (!user || user.role !== EnumRole.SUPER_ADMIN) {
      throw new ForbiddenException('Permission denied.');
    }
    return this.stripeService.distributeFundsForOrder(orderId);
  }

  public async orderItemPayToCustomer(user: User, orderItemId: string) {
    if (!user || user.role !== EnumRole.SUPER_ADMIN) {
      throw new ForbiddenException('Permission denied.');
    }
    return this.stripeService.distributeFundsForOrderItem(orderItemId);
  }
}
