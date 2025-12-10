import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DistributeSellerDto {
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

export class DistributeOrderItemDto {
  @ApiProperty({
    description: 'Distribute funds success status.',
    type: Boolean,
  })
  @IsOptional()
  success?: boolean;

  @ApiProperty({
    description: 'Distribute funds transfer ID.',
    type: String,
  })
  @IsOptional()
  transferId?: string;

  @ApiProperty({
    description: 'Distribute funds amount.',
    type: Number,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Distribute funds amount.',
    type: () => DistributeSellerDto,
  })
  @IsOptional()
  seller?: DistributeSellerDto;
}

export class DistributeOrderResultDto {
  @ApiProperty({
    description: 'Distribute funds orderItemId.',
    type: String,
  })
  @IsOptional()
  orderItemId?: string;

  @ApiProperty({
    description: 'Distribute funds sellerId.',
    type: String,
  })
  @IsOptional()
  sellerId?: string;

  @ApiProperty({
    description: 'Distribute funds transferId.',
    type: String,
  })
  @IsOptional()
  transferId?: string;

  @ApiProperty({
    description: 'Distribute funds amount.',
    type: Number,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Distribute funds success status.',
    type: Boolean,
  })
  @IsOptional()
  success?: boolean;
}

export class DistributeOrderDto {
  @ApiProperty({
    description: 'Distribute funds order id.',
    type: String,
  })
  @IsOptional()
  orderId?: string;

  @ApiProperty({
    description: 'Distribute funds order items count.',
    type: Number,
  })
  @IsOptional()
  totalItems?: number;

  @ApiProperty({
    description: 'Distribute funds successful transfers count.',
    type: Number,
  })
  @IsOptional()
  successfulTransfers?: number;

  @ApiProperty({
    description: 'Distribute funds failed transfers count.',
    type: Number,
  })
  @IsOptional()
  failedTransfers?: number;

  @ApiProperty({
    description: 'Distribute funds totalAmount.',
    type: Number,
  })
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({
    description: 'Distribute funds amount.',
    type: () => DistributeSellerDto,
  })
  @IsOptional()
  seller?: DistributeSellerDto;

  @ApiProperty({
    description: 'Distribute funds result',
    type: () => DistributeOrderResultDto,
  })
  @IsOptional()
  results: DistributeOrderResultDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  @IsOptional()
  createdAt: Date;
}
