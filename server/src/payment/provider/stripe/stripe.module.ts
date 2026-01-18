import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { BillingInfoService } from 'src/billing-info/billing-info.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { OrderService } from 'src/order/order.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { ProductService } from 'src/product/product.service';
import { CloudinaryFileService } from 'src/cloudinary-file/cloudinary-file.service';

@Module({
  controllers: [],
  providers: [
    StripeService,
    PrismaService,
    UserService,
    ConfigService,
    BillingInfoService,
    SubscriptionService,
    OrderService,
    QueryPayloadBuilderService,
    ProductService,
    CloudinaryFileService
  ],
  exports: [StripeService],
})
export class StripeModule {}
