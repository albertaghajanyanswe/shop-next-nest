import { BillingPeriod, EnumSubscriptionType, PaymentProvider } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class InitSubscriptionPaymentRequest {
  @IsEnum(EnumSubscriptionType)
  @IsNotEmpty()
  public planId: EnumSubscriptionType;

  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}

export class CancelSubscriptionRequest {
  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}
