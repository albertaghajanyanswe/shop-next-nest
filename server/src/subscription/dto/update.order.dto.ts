import { ApiProperty } from '@nestjs/swagger';
import { EnumOrderStatus } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status',
    example: EnumOrderStatus.SUCCEEDED,
  })
  @IsEnum(EnumOrderStatus)
  @IsOptional()
  public status?: EnumOrderStatus;

  @ApiProperty({
    description: 'Order provider meta object',
    example: {},
  })
  @IsObject()
  @IsOptional()
  public providerMeta?: object;

  @ApiProperty({
    description: 'Stripe Payment Intent ID',
    example: 'pi_1JXXXXXX',
  })
  @IsString()
  @IsOptional()
  public stripePaymentIntentId?: string;
}
