import { ApiProperty } from '@nestjs/swagger';
import {
  EnumSubscriptionType,
  PaymentProvider,
} from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class InitSubscriptionPaymentRequest {
  @ApiProperty({
    required: true,
    example: EnumSubscriptionType.FREE,
    description: 'Subscription plan unique id',
  })
  @IsEnum(EnumSubscriptionType)
  @IsNotEmpty()
  public planId: EnumSubscriptionType;

  @ApiProperty({
    required: true,
    example: PaymentProvider.STRIPE,
    description: 'Subscription provider name',
  })
  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}

export class CancelSubscriptionRequest {
  @ApiProperty({
    required: true,
    example: PaymentProvider.STRIPE,
    description: 'Subscription provider name',
  })
  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}
