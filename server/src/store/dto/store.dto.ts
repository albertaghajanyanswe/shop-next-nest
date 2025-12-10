import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
    example: 'Vesta electronics store',
    description: 'Store description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String], description: 'Store images URLs' })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    example: 'Armenia',
    description: 'Store country',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: 'Erevan',
    description: 'Store city',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Shinararneri 7/23',
    description: 'Store address',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '+37495898795',
    description: 'Store phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

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

  @ApiProperty({
    example: 'Store description',
    description: 'Store description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'userId123',
    description: 'Owner user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    required: true,
    description: 'Store images',
    example: [
      'https://res.cloudinary.com/dvuo50sjj/image/upload/w_500,q_auto,f_auto/v1764687769/products/mfhyojzhx8drdd6zlzwf.webp',
    ],
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  images?: string[];

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

export class GetStoreDtoAndCount {
  @ApiProperty({
    type: () => GetStoreDto,
    required: false,
    isArray: true,
  })
  stores: GetStoreDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}
