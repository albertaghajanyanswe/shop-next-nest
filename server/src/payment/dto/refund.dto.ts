import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RefundSellerDto {
  @ApiProperty({
    description: 'Distribute funds seller ID.',
    type: String,
  })
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Distribute funds seller name.',
    type: String,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Distribute funds seller email.',
    type: String,
  })
  @IsOptional()
  email?: string;
}

export class RefundOrderItemDto {
  @ApiProperty({
    description: 'Refund success status.',
    type: Boolean,
  })
  @IsOptional()
  success?: boolean;

  @ApiProperty({
    description: 'Refund ID.',
    type: String,
  })
  @IsOptional()
  refundId?: string;

  @ApiProperty({
    description: 'ReversalId ID.',
    type: String,
  })
  @IsOptional()
  reversalId?: string;

  @ApiProperty({
    description: 'Refund amount.',
    type: Number,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Refund seller details.',
    type: () => RefundSellerDto,
  })
  @IsOptional()
  seller?: RefundSellerDto;
}

export class RefundOrderResultDto {
  @ApiProperty({
    description: 'Refund orderItemId.',
    type: String,
  })
  @IsOptional()
  orderItemId?: string;

  @ApiProperty({
    description: 'Refund sellerId.',
    type: String,
  })
  @IsOptional()
  sellerId?: string;

  @ApiProperty({
    description: 'Refund transferId.',
    type: String,
  })
  @IsOptional()
  refundId?: string;

    @ApiProperty({
    description: 'Refund transferId.',
    type: String,
  })
  @IsOptional()
  reversalId?: string;

  @ApiProperty({
    description: 'Refund amount.',
    type: Number,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Refund success status.',
    type: Boolean,
  })
  @IsOptional()
  success?: boolean;

    @ApiProperty({
    description: 'Refund success status.',
    type: Boolean,
  })
  @IsOptional()
  error?: boolean;
}

export class RefundOrderDto {
  @ApiProperty({
    description: 'Refund order id.',
    type: String,
  })
  @IsOptional()
  orderId?: string;

  @ApiProperty({
    description: 'Refund order items count.',
    type: Number,
  })
  @IsOptional()
  totalItems?: number;

  @ApiProperty({
    description: 'Refund successful transfers count.',
    type: Number,
  })
  @IsOptional()
  successfulRefunds?: number;

  @ApiProperty({
    description: 'Refund failed transfers count.',
    type: Number,
  })
  @IsOptional()
  failedRefunds?: number;

  @ApiProperty({
    description: 'Refund totalAmount.',
    type: Number,
  })
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({
    description: 'Refund amount.',
    type: () => RefundSellerDto,
  })
  @IsOptional()
  seller?: RefundSellerDto;

  @ApiProperty({
    description: 'Refund result',
    type: () => RefundOrderResultDto,
  })
  @IsOptional()
  results: RefundOrderResultDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  @IsOptional()
  createdAt: Date;
}