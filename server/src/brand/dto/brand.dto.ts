import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCategoryDto } from 'src/category/dto/category.dto';

export class BrandDto {
  @ApiProperty({
    required: true,
    example: 'Dell',
    description: 'Product brand',
  })
  @IsString({
    message: 'Brand name is required',
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Category images',
    example: ['/server-uploads/brands/1763382867638-iphone 14 pro.jpeg'],
  })
  @IsString({
    message: 'Please provide at least one brand image',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Brand must have at least one image',
  })
  @IsNotEmpty({
    each: true,
    message: 'Brand image urls cannot be empty',
  })
  images: string[];
}

export class GetBrandDto {
  @ApiProperty({ example: 'clx12abcx0000c0brand111', description: 'Brand ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({
    required: true,
    example: 'Dell',
    description: 'Brand name',
  })
  @IsString({ message: 'Brand name is required' })
  name: string;

  @ApiProperty({
    required: false,
    example: 'Dell popular Notebook brand',
    description: 'Brand desc',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Category images',
    example: ['/server-uploads/brands/1763382867638-iphone 14 pro.jpeg'],
  })
  @IsString({
    message: 'Please provide at least one brand image',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Brand must have at least one image',
  })
  @IsNotEmpty({
    each: true,
    message: 'Brand image urls cannot be empty',
  })
  images: string[];

  @ApiProperty({
    required: false,
    example: 5,
    description: 'Brand rating value',
  })
  @IsNumber({}, { message: 'Rating should be number' })
  @IsOptional()
  rating: number;

  @ApiProperty({
    example: 'storeId123',
    description: 'Store ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  storeId?: string;

  @ApiProperty({
    example: 'userId123',
    description: 'User ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class GetBrandDtoAndCount {
  @ApiProperty({
    type: () => GetBrandDto,
    required: false,
    isArray: true,
  })
  brands: GetBrandDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}
