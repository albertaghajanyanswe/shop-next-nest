import { BillingPeriod, PaymentProvider } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class InitSubscriptionPaymentRequest {
  @IsString()
  @IsNotEmpty()
  public planId: string;

  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}

export class CancelSubscriptionRequest {
  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}
