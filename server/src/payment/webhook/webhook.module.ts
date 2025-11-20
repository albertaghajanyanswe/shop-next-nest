import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { YoomoneyModule } from '../provider/yoomoney/yoomoney.module';
import { StripeModule } from '../provider/stripe/stripe.module';
import { PaymentHandler } from '../payment.handler';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [YoomoneyModule, StripeModule],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentHandler, PrismaService],
})
export class WebhookModule {}
