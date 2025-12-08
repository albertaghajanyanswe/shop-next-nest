import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import {
  BillingPeriod,
  CurrencyEnum,
  EnumOrderStatus,
  Order,
  PaymentProvider,
  Plan,
  User,
} from '@prisma/client';
import { PaymentStatusDto, ProductPaymentDto } from 'src/payment/dto';
import CIDR from 'ip-cidr';
import { YookassaWebhookDto } from 'src/payment/webhook/dto';
import type { PaymentWebhookResult } from 'src/payment/interfaces';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID'] as string,
  secretKey: process.env['YOOKASSA_SECRET_KEY'] as string,
});

@Injectable()
export class YoomoneyService {
  private readonly ALLOWED_IPS: string[];
  constructor(private prisma: PrismaService) {
    this.ALLOWED_IPS = [
      '185.71.76.0/27',
      '185.71.77.0/27',
      '77.75.153.0/25',
      '77.75.156.11',
      '77.75.156.35',
      '77.75.154.128/25',
      '2a02:5180::/32',
    ];
  }

  public async handleWebhook(
    dto: YookassaWebhookDto,
  ): Promise<PaymentWebhookResult> {
    const orderId = dto.object.metadata?.orderId;
    const planId = dto.object.metadata?.planId;
    const paymentId = dto.object.id;

    let status: EnumOrderStatus = EnumOrderStatus.PENDING;

    switch (dto.event) {
      case 'payment.waiting_for_capture':
        const capturePayment: ICapturePayment = {
          amount: {
            value: dto.object.amount.value,
            currency: dto.object.amount.currency,
          },
        };
        await checkout.capturePayment(paymentId, capturePayment);
        break;
      case 'payment.succeeded':
        status = EnumOrderStatus.SUCCEEDED;
        break;
      case 'payment.canceled':
        status = EnumOrderStatus.FAILED;
        break;
    }

    return {
      orderId,
      planId,
      paymentId,
      status,
      raw: dto,
    };
  }

  public verifyWebhookIp(ip: string): boolean {
    for (const range of this.ALLOWED_IPS) {
      if (range.includes('/')) {
        const cidr = new CIDR(range);
        if (cidr.contains(ip)) {
          return true;
        }
      } else if (ip === range) {
        return true;
      }
    }
    console.log('Invalid IP');
    return false;
  }

  async upgradeSubscription(user: User, plan: Plan) {
    const order = await this.prisma.order.create({
      data: {
        totalPrice: plan.price,
        provider: PaymentProvider.YOOKASSA,
        user: {
          connect: {
            id: user.id,
          },
        },
        // subscription: {
        //   create: {
        //     user: {
        //       connect: {
        //         id: user.id,
        //       },
        //     },
        //     plan: {
        //       connect: {
        //         id: plan.id,
        //       },
        //     },
        //     period: plan.period,
        //   },
        // },
      },
    });

    const payment = await checkout.createPayment({
      amount: {
        value: plan.price.toFixed(2),
        currency: CurrencyEnum.USD, // todo
      },
      payment_method_data: {
        type: 'bank_card',
      },
      confirmation: {
        type: `redirect`,
        return_url: `${process.env.CLIENT_URL}/thanks`,
      },
      save_payment_method: true,
      description: `Order purchase in the Your Store. Payment Id: #${order.id}`,
      metadata: {
        userId: user.id,
        orderId: order.id,
        planId: plan.id,
      },
    });

    return payment;
  }

  async buyProduct(dto: ProductPaymentDto, userId: string) {
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
          provider: PaymentProvider.YOOKASSA,
          orderItems: {
            create: orderItems,
          },
          totalPrice,
          user: {
            connect: {
              id: userId,
            },
          },
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
}
