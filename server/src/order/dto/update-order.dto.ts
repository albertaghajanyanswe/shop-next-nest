import { ApiProperty } from '@nestjs/swagger';
import { EnumOrderItemStatus, EnumOrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({
    example: EnumOrderStatus.PENDING,
    enum: EnumOrderStatus,
    description: 'Order status',
  })
  status: EnumOrderStatus;
}

export class UpdateOrderItemDto {
  @ApiProperty({
    example: EnumOrderItemStatus.PENDING,
    enum: EnumOrderItemStatus,
    description: 'Order item status',
  })
  status: EnumOrderItemStatus;
}