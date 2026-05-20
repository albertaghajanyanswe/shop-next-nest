import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getMailerConfig } from 'src/config';
import { PrismaService } from 'src/prisma.service';
import {
  SubscribedEmailsDtoResponse,
  SubscribeEmailDto,
} from './dto/subscribe.dto';
import { render } from '@react-email/components';
import { NewProductTemplate } from './templates/newProduct.template';

@Injectable()
export class SubscribeNewsService {
  private transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    try {
      this.transporter = nodemailer.createTransport(
        getMailerConfig(this.configService),
      );
    } catch (err) {
      console.error('SubscribeNewsService - ', err);
    }
  }

  async subscribe(
    data: SubscribeEmailDto,
  ): Promise<SubscribedEmailsDtoResponse> {
    try {
      const { email } = data;

      const existingSubscription =
        await this.prisma.emailSubscription.findUnique({
          where: { email },
        });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          return {
            success: false,
            message: 'Email is already subscribed.',
          };
        }
        await this.prisma.emailSubscription.update({
          where: { email },
          data: { isActive: true },
        });
        return {
          success: true,
          message: 'Successfully resubscribed.',
        };
      }

      await this.prisma.emailSubscription.create({
        data: { email },
      });

      return {
        success: true,
        message: 'Successfully subscribed to new product notifications.',
      };
    } catch (err) {
      console.error('subscribe - ', err);
      return {
        success: false,
        message: 'Could not subscribe email.',
      };
    }
  }

  async unsubscribe(email: string) {
    try {
      await this.prisma.emailSubscription.update({
        where: { email },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Successfully unsubscribed.',
      };
    } catch (err) {
      console.error('unsubscribe - ', err);
      return {
        success: false,
        message: 'Could not unsubscribe email.',
      };
    }
  }

  async sendNewProductNotification(product: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    images: string[];
    store?: { title: string } | null;
    category?: { name: string } | null;
    brand?: { name: string } | null;
  }) {
    try {
      const subscribers = await this.prisma.emailSubscription.findMany({
        where: { isActive: true },
      });

      if (subscribers.length === 0) {
        return { success: true, message: 'No active subscribers.' };
      }

      const productImage = product.images?.[0] || '';
      const storeName = product.store?.title || 'Unknown Store';
      const categoryName = product.category?.name || '';
      const brandName = product.brand?.name || '';

      const html = await render(
        NewProductTemplate({
          productName: product.title,
          productDescription: product.description || '',
          productPrice: product.price,
          productImage,
          storeName,
          category: categoryName,
          brand: brandName,
        }),
      );

      const emailPromises = subscribers.map((subscriber) =>
        this.transporter.sendMail({
          from: 'albert.aghajanyan.swe@gmail.com',
          to: subscriber.email,
          subject: `New Product: ${product.title}`,
          text: '',
          html,
        }),
      );

      await Promise.all(emailPromises);

      return {
        success: true,
        message: `New product notification sent to ${subscribers.length} subscribers.`,
      };
    } catch (err) {
      console.error('sendNewProductNotification - ', err);
      return {
        success: false,
        message: 'Could not send product notifications.',
      };
    }
  }
}
