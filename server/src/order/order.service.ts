import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICapturePayment, YooCheckout } from '@a2seven/yoo-checkout';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { EnumOrderStatus } from '@prisma/client';

const checkout = new YooCheckout({
  shopId: process.env['YOOKASSA_SHOP_ID'] as string,
  secretKey: process.env['YOOKASSA_SECRET_KEY'] as string,
});

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createPayment(dto: OrderDto, userId: string) {
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
          status: EnumOrderStatus.PAYED,
        },
      });
      return true;
    }

    return true;
  }
}
