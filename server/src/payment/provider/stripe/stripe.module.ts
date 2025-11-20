import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { BillingInfoService } from 'src/billing-info/billing-info.service';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Module({
  controllers: [],
  providers: [
    StripeService,
    PrismaService,
    UserService,
    ConfigService,
    BillingInfoService,
    SubscriptionService
  ],
  exports: [StripeService],
})
export class StripeModule {}
