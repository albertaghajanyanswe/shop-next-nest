import { EnumOrderStatus } from '@prisma/client';
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
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Order status must be one of ${Object.values(EnumOrderStatus).join(', ')}`,
  })
  status: EnumOrderStatus;

  @IsArray({
    message: 'Order does not contain product',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber({}, { message: 'Quantity should be a number' })
  quantity: number;

  @IsNumber({}, { message: 'Price should be a number' })
  price: number;

  @IsString({ message: 'Product ID should be string' })
  productId: number;

  @IsString({ message: 'Store ID should be string' })
  storeId: number;
}
