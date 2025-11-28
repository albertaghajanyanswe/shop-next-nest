import { ApiProperty } from '@nestjs/swagger';
import {
  BillingPeriod,
  EnumSubscriptionStatus,
  EnumSubscriptionType,
} from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetSubscriptionDto {
  @ApiProperty({
    description: 'Subscription unique identifier from Stripe',
    example: 'TKyCIBiPTFs6Lq',
  })
  @IsString()
  @IsOptional()
  public stripeSubscriptionId?: string;

  @ApiProperty({
    description: 'Subscription status',
    example: EnumSubscriptionStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(EnumSubscriptionStatus)
  public status: EnumSubscriptionStatus;

  @ApiProperty({
    description: 'Subscription created at date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  public createdAt?: Date;

  @ApiProperty({
    description: 'Subscription next billing date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  nextBillingDate?: Date | null;

  @ApiProperty({
    description: 'Subscription start date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  public startDate?: string;

  @ApiProperty({
    description: 'Subscription end date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsString()
  @IsOptional()
  public endDate?: string;

  @ApiProperty({
    description: 'Subscription trial end date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  public trialEndAt?: Date;

  @ApiProperty({
    description: 'Subscription period',
    example: BillingPeriod.MONTHLY,
  })
  @IsEnum(BillingPeriod)
  public period: BillingPeriod;

  @ApiProperty({
    description: 'Store limit for the plan',
    example: 10,
  })
  @IsNumber()
  public storeLimit: number | null;

  @ApiProperty({
    description: 'Product limit for the plan',
    example: 100,
  })
  @IsNumber()
  public productLimit: number | null;

  @ApiProperty({
    description: 'Subscription customer ID',
    example: 'TKyCIBiPTFs6Lq',
  })
  @IsString()
  @IsOptional()
  public customerId?: string;

  @ApiProperty({
    description: 'Subscription user ID',
    example: 'TKyCIBiPTFs6Lq',
  })
  @IsString()
  public userId: string;

  @ApiProperty({
    description: 'Subscription plan ID',
    example: EnumSubscriptionType.FREE,
  })
  @IsEnum(EnumSubscriptionType)
  public planId: EnumSubscriptionType;

  @ApiProperty({
    description: 'Subscription next plan ID',
    example: EnumSubscriptionType.FREE,
  })
  @IsEnum(EnumSubscriptionType)
  @IsOptional()
  public nextPlanId?: EnumSubscriptionType;

  @ApiProperty({
    description: 'Subscription canceled date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  public cancelledAt?: Date;

  @ApiProperty({
    description: 'Subscription canceled reason',
    example: {},
  })
  @IsJSON()
  @IsOptional()
  public cancelledReason?: object;

  @ApiProperty({
    description: 'Subscription paused date',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  public pausedAt?: Date | null;
}
