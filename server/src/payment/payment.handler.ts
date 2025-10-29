import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { PaymentWebhookResult } from './interfaces';
import { BillingPeriod, EnumOrderStatus, EnumSubscriptionStatus } from '@prisma/client';

@Injectable()
export class PaymentHandler {
  private readonly logger = new Logger(PaymentHandler.name);

  public constructor(private readonly prismaService: PrismaService) {}

  public async processResult(result: PaymentWebhookResult) {
    const { orderId, planId, paymentId, status, raw } = result;
    this.logger.log(`[Func] processResult: ${JSON.stringify(result)}`);
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        subscription: {
          include: {
            plan: true,
            user: true,
          },
        },
      },
    });

    if (!order) {
      this.logger.error(
        `[Func] processResult: Order not found. orderId=${orderId}`,
      );
      throw new Error('Order not found');
    }

    await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        status: status,
        externalId: paymentId,
        providerMeta: raw,
      },
    });

    const subscription = order.subscription;
    if (!subscription) {
      this.logger.log(
        `[Func] processResult: No subscription associated with orderId=${orderId}`,
      );
      throw new Error('No subscription associated with order');
    }
    if (status === EnumOrderStatus.SUCCEEDED && order.subscription) {
      const now = new Date();
      const isPlanChanged = subscription?.planId !== planId;
      let baseDate: Date;

      if (
        !subscription.endDate ||
        subscription.endDate < now ||
        isPlanChanged
      ) {
        baseDate = new Date(now);
      } else {
        baseDate = new Date(subscription.endDate);
      }

      let newEndDate: Date = new Date(baseDate);

      if (order.billingPeriod === BillingPeriod.YEARLY) {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      } else {
        const currentDay = newEndDate.getDate();
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        if (newEndDate.getDate() !== currentDay) {
          newEndDate.setDate(0);
        }
      }

      await this.prismaService.subscription.update({
        where: { id: subscription.id },
        data: {
          status: EnumSubscriptionStatus.ACTIVE,
          startDate: now,
          endDate: newEndDate,
          plan: {
            connect: {
              id: planId,
            }
          }
        },
      });

      this.logger.log(
        `Payment succeeded ${subscription.user.email}`,
      );
    } else if (status === EnumOrderStatus.FAILED) {
      await this.prismaService.subscription.update({
        where: { id: subscription.id },
        data: {
          status: EnumSubscriptionStatus.EXPIRED,
        },
      });
      this.logger.log(
        `Payment failed for ${subscription.user.email}`,
      );
    }
    return { ok: true }
  }
}
