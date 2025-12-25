import { ApiProperty } from '@nestjs/swagger';
import {
  BillingPeriod,
  EnumSubscriptionStatus,
  EnumSubscriptionType,
} from '@prisma/client';
import { IsEnum } from 'class-validator';

export class GetPlansDto {
  @ApiProperty({
    example: 'clx12abcx0000c0prod111',
    description: 'Plan ID',
  })
  id: string;

  @ApiProperty({
    description: 'Plan planId',
    enum: EnumSubscriptionType,
  })
  @IsEnum(EnumSubscriptionType)
  planId: EnumSubscriptionType;

  @ApiProperty({ description: 'Plan desc' })
  description: string;

  @ApiProperty({ description: 'Plan price' })
  price: Number;

  @ApiProperty({
    description: 'Subscription period',
    enum: BillingPeriod,
  })
  @IsEnum(BillingPeriod)
  period: BillingPeriod;

  @ApiProperty({ description: 'Plan store limit' })
  storeLimit: Number;

  @ApiProperty({ description: 'Plan product limit' })
  productLimit: Date;

  @ApiProperty({ description: 'Plan is popular flag' })
  isPopular: boolean;

  @ApiProperty({ description: 'Stripe product id' })
  stripeProductId: String;

  @ApiProperty({ description: 'Stripe price id' })
  stripePriceId: String;

  @ApiProperty({ description: 'Plan features list' })
  features: String[];

  @ApiProperty({ description: 'Created date timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date timestamp' })
  updatedAt: Date;
}
