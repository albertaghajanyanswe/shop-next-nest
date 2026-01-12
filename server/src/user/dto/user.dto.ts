import { ApiProperty } from '@nestjs/swagger';
import { EnumRole } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { GetBillingInfoDto } from 'src/billing-info/dto/billingInfo.dto';
import { GetOrderDto } from 'src/order/dto/order.dto';
import { GetSubscriptionsDto } from 'src/payment/dto/subscriptions.dto';
import { GetProductDto } from 'src/product/dto/product.dto';
import { GetReviewDto } from 'src/review/dto/review.dto';
import { GetStoreDto } from 'src/store/dto/store.dto';
import { GetSubscriptionDto } from 'src/subscription/dto/subscription.dto';

export class GetUserDto {
  @ApiProperty({ example: 'clx12abcx0000c0qwerty111', description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({
    example: 'secret',
    description: 'User password',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dvuo50sjj/image/upload/w_500,q_auto,f_auto/v1764687769/products/mfhyojzhx8drdd6zlzwf.webp',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({
    example: 'Store country',
    description: 'Store country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: 'Store city',
    description: 'Store city',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'Store address',
    description: 'Store address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Store phone',
    description: 'Store phone',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'johndoe', description: 'Username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    type: () => [GetStoreDto],
    required: false,
    description: 'Stores created by user',
  })
  @IsOptional()
  @IsArray()
  stores?: GetStoreDto[];

  @ApiProperty({
    type: () => [GetProductDto],
    required: false,
    description: 'Favorite products',
  })
  @IsOptional()
  @IsArray()
  favorites?: GetProductDto[];

  @ApiProperty({
    type: () => [GetReviewDto],
    required: false,
    description: 'Reviews by user',
  })
  @IsOptional()
  @IsArray()
  reviews?: GetReviewDto[];

  @ApiProperty({
    type: () => [GetOrderDto],
    required: false,
    description: 'Orders by user',
  })
  @IsOptional()
  @IsArray()
  orders?: GetOrderDto[];

  @ApiProperty({
    type: () => [GetProductDto],
    required: false,
    description: 'Products created by user',
  })
  @IsOptional()
  @IsArray()
  products?: GetProductDto[];

  @ApiProperty({
    type: () => GetBillingInfoDto,
    required: false,
    description: 'Billing information',
  })
  @IsOptional()
  billingInfo?: GetBillingInfoDto;

  @ApiProperty({
    type: () => [GetSubscriptionDto],
    required: false,
    description: 'User subscriptions',
  })
  @IsOptional()
  @IsArray()
  subscription?: GetSubscriptionDto[];

  @ApiProperty({
    example: 'acct_12345',
    description: 'Stripe account ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripeAccountId?: string;

  @ApiProperty({
    description: 'User role',
    example: EnumRole,
  })
  @IsOptional()
  @IsEnum(EnumRole)
  public role: EnumRole;

  @ApiProperty({
    type: () => [GetSubscriptionsDto],
    required: false,
    description: 'User subscriptions',
  })
  @IsOptional()
  @IsArray()
  subscriptions?: GetSubscriptionsDto[];
}
