import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class StoreDto {
  @ApiProperty({
    required: true,
    example: 'Vesta',
    description: 'Store name',
  })
  @IsString({
    message: 'Store name is required',
  })
  title: string;

  @ApiProperty({
    required: true,
    example: 'Vesta electronics store',
    description: 'Store description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    example: true,
    description:
      'Mark is this default store, each user can have one default store',
  })
  @IsOptional()
  @IsBoolean({
    message: 'isDefaultStore must be a boolean',
  })
  isDefaultStore?: boolean;
}

export class GetStoreDto {
  @ApiProperty({ example: 'clx12abcx0000c0store111', description: 'Store ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'Awesome Store', description: 'Store title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Store description', description: 'Store description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'userId123', description: 'Owner user ID', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: 'https://image.com/store.png', description: 'Store image', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: true, description: 'Is default store' })
  @IsBoolean()
  isDefaultStore: boolean;

  @ApiProperty({ example: true, description: 'Is published' })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: false, description: 'Is blocked' })
  @IsBoolean()
  isBlocked: boolean;
}