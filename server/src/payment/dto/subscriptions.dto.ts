import { ApiProperty } from '@nestjs/swagger';
import {
  BillingPeriod,
  EnumSubscriptionStatus,
  EnumSubscriptionType,
} from '@prisma/client';
import { IsEnum } from 'class-validator';

export class GetSubscriptionsDto {
  @ApiProperty({
    example: 'clx12abcx0000c0prod111',
    description: 'Subscription ID',
  })
  id: string;

  @ApiProperty({ description: 'Stripe Subscription Id' })
  stripeSubscriptionId: string;

  @ApiProperty({
    description: 'Subscription status',
    enum: EnumSubscriptionStatus,
  })
  @IsEnum(EnumSubscriptionStatus)
  status: EnumSubscriptionStatus;

  @ApiProperty({ description: 'Start date timestamp' })
  startDate: Date;

  @ApiProperty({ description: 'End date timestamp' })
  endDate: Date;

  @ApiProperty({ description: 'Next billing date timestamp' })
  nextBillingDate: Date;

  @ApiProperty({ description: 'Trial end date timestamp' })
  trialEndAt: Date;

  @ApiProperty({
    description: 'Subscription period',
    enum: BillingPeriod,
  })
  @IsEnum(BillingPeriod)
  period: BillingPeriod;

  @ApiProperty({ description: 'Subscription store limit' })
  storeLimit: number;

  @ApiProperty({ description: 'Subscription product limit' })
  productLimit: number;

  @ApiProperty({ description: 'Stripe customer id' })
  customerId: String;

  @ApiProperty({ description: 'Subscription user id' })
  userId: String;

  @ApiProperty({
    description: 'Subscription planId',
    enum: EnumSubscriptionType,
  })
  @IsEnum(EnumSubscriptionType)
  planId: EnumSubscriptionType;

  @ApiProperty({
    description: 'Subscription next planId',
    enum: EnumSubscriptionType,
  })
  @IsEnum(EnumSubscriptionType)
  nextPlanId: EnumSubscriptionType;

  @ApiProperty({ description: 'Cancelled date timestamp' })
  cancelledAt: Date;

  @ApiProperty({ description: 'Cancelled reason text' })
  cancelledReason: String;

  @ApiProperty({ description: 'Paused date timestamp' })
  pausedAt: Date;

  @ApiProperty({ description: 'Created date timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date timestamp' })
  updatedAt: Date;
}
