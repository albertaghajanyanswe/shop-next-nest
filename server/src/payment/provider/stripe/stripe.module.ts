import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { BillingInfoService } from 'src/billing-info/billing-info.service';

@Module({
  controllers: [StripeController],
  providers: [
    StripeService,
    PrismaService,
    UserService,
    ConfigService,
    BillingInfoService,
  ],
})
export class StripeModule {}
