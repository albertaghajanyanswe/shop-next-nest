import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    required: true,
    example: 'Notebooks',
    description: 'Product category name',
  })
  @IsString({
    message: 'Category name is required',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: 'Description of the category',
    description: 'Description of the category',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Category images',
    example: ['/server-uploads/categories/1763382867638-iphone 14 pro.jpeg'],
  })
  @IsString({
    message: 'Please provide at least one category image',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Category must have at least one image',
  })
  @IsNotEmpty({
    each: true,
    message: 'Category image urls cannot be empty',
  })
  images: string[];
}

export class GetCategoryDto {
  @ApiProperty({ example: 'clx12abcx0000c0cat111', description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({
    required: true,
    example: 'Laptops',
    description: 'Product category name',
  })
  @IsString({ message: 'Category name is required' })
  name: string;

  @ApiProperty({
    required: false,
    example: 'High-end laptops',
    description: 'Description of the category',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'Category images',
    example: ['/server-uploads/categories/1763382867638-iphone 14 pro.jpeg'],
  })
  @IsString({
    message: 'Please provide at least one category image',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Category must have at least one image',
  })
  @IsNotEmpty({
    each: true,
    message: 'Category image urls cannot be empty',
  })
  images: string[];

  @ApiProperty({
    required: false,
    example: 5,
    description: 'Category rating value',
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

export class GetCategoryDtoAndCount {
  @ApiProperty({
    type: () => GetCategoryDto,
    required: false,
    isArray: true,
  })
  categories: GetCategoryDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}
