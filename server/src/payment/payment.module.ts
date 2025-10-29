import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { YoomoneyModule } from './provider/yoomoney/yoomoney.module';
import { PrismaService } from 'src/prisma.service';
import { WebhookModule } from './webhook/webhook.module';
import { StripeModule } from './provider/stripe/stripe.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  imports: [ WebhookModule, YoomoneyModule, StripeModule],
})
export class PaymentModule {}
