import { ApiProperty } from '@nestjs/swagger';
import { EnumOrderStatus, PaymentProvider } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderDto {
  @ApiProperty({
    required: false,
    example: EnumOrderStatus.SUCCEEDED,
    description: 'Order status value',
  })
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Order status must be one of ${Object.values(EnumOrderStatus).join(', ')}`,
  })
  status: EnumOrderStatus;

  @ApiProperty({
    required: false,
    example: () => [OrderItemDto],
    description: 'Order items',
  })
  @IsArray({
    message: 'Order does not contain product',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  orderItems: OrderItemDto[];
}

export class GetOrderDto {
  @ApiProperty({
    example: 'ord_1234567890',
    description: 'Unique order ID',
  })
  id: string;

  @ApiProperty({
    example: 'pi_1234567890',
    required: false,
    description: 'Stripe Payment Intent ID (optional)',
  })
  stripePaymentIntentId?: string | null;

  @ApiProperty({
    example: 129.99,
    description: 'Total order price',
  })
  totalPrice: number;

  @ApiProperty({
    example: PaymentProvider.STRIPE,
    enum: PaymentProvider,
    description: 'Payment provider used for the order',
  })
  provider: PaymentProvider;

  @ApiProperty({
    example: EnumOrderStatus.PENDING,
    enum: EnumOrderStatus,
    description: 'Order status',
  })
  status: EnumOrderStatus;

  @ApiProperty({
    example: 'ext_992233',
    required: false,
    description: 'External payment ID',
  })
  externalId?: string | null;

  @ApiProperty({
    example: { transactionId: '123', meta: 'data' },
    required: false,
    description: 'Payment provider metadata',
  })
  providerMeta?: any | null;

  @ApiProperty({
    example: 'user_123',
    description: 'User ID associated with this order',
  })
  userId: string;

  @ApiProperty({
    example: 'sub_333',
    required: false,
    description: 'Subscription ID (only if order is subscription payment)',
  })
  subscriptionId?: string | null;

  @ApiProperty({
    example: '2025-01-01T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-05T12:00:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}

export class OrderItemDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'Order item quantity',
  })
  @IsNumber({}, { message: 'Quantity should be a number' })
  quantity: number;

  @ApiProperty({
    required: true,
    example: 11,
    description: 'Order item price',
  })
  @IsNumber({}, { message: 'Price should be a number' })
  price: number;

  @ApiProperty({
    required: true,
    example: 'cmi34do3j0009c0qlo4dijyre',
    description: 'Order item product id',
  })
  @IsString({ message: 'Product ID should be string' })
  productId: number;

  @ApiProperty({
    required: true,
    example: 'cmi34do3j0009c0qlo4dijyre',
    description: 'Order item store id',
  })
  @IsString({ message: 'Store ID should be string' })
  storeId: number;

  @ApiProperty({
    required: false,
    example: 'Order item name',
    description: 'Order item name',
  })
  @IsOptional()
  @IsString({ message: 'Name should be string' })
  name?: string;

  @ApiProperty({
    required: false,
    example: 'Order item desc',
    description: 'Order item desc',
  })
  @IsOptional()
  @IsString({ message: 'Description should be string' })
  description?: string;

  @ApiProperty({
    required: false,
    example: 'Order item image',
    description: 'Order item image',
  })
  @IsOptional()
  @IsString({ message: 'Image should be string' })
  image?: string;

  @ApiProperty({
    required: true,
    example: 'cmi34do3j0009c0qlo4dijyre',
    description: 'Owner user id',
  })
  @IsString({ message: 'User ID should be string' })
  userId: string;
}

export class GetOrderItemDto extends OrderItemDto {
  @ApiProperty({
    example: 'oi_123',
    description: 'Order item ID',
  })
  id: string;

  @ApiProperty({
    example: '2025-01-10T12:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-11T12:00:00.000Z',
    description: 'Updated timestamp',
  })
  updatedAt: Date;
}

export class GetOrderWithItemsDto extends GetOrderDto {
  @ApiProperty({ type: () => GetOrderItemDto, isArray: true })
  orderItems: GetOrderItemDto;
}

export class GetOrderWithItemsDtoAndCount {
  @ApiProperty({
    type: () => GetOrderWithItemsDto,
    required: false,
    isArray: true,
  })
  orders: GetOrderWithItemsDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}
