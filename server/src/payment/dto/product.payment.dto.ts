import { ApiProperty } from '@nestjs/swagger';
import { EnumOrderStatus, Plan } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OrderItemDto } from 'src/order/dto/order.dto';

export class ProductPaymentDto {
  @ApiProperty({
    description: 'Payment order status',
    type: () => EnumOrderStatus,
  })
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message: `Order status must be one of ${Object.values(EnumOrderStatus).join(', ')}`,
  })
  status?: EnumOrderStatus;

  @ApiProperty({
    description: 'Payment order items list',
    type: () => [OrderItemDto],
  })
  @IsArray({
    message: 'Order does not contain product',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

export type CreatePlanType = Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>;
