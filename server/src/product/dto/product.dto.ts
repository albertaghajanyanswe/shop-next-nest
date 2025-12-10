import { ApiProperty } from '@nestjs/swagger';
import { EnumProductState } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetBrandDto } from 'src/brand/dto/brand.dto';
import { GetCategoryDto } from 'src/category/dto/category.dto';
import { GetColorDto } from 'src/color/dto/color.dto';
import { GetReviewDto, GetReviewWithUserDto } from 'src/review/dto/review.dto';
import { GetStoreDto } from 'src/store/dto/store.dto';
import { GetUserDto } from 'src/user/dto/user.dto';

export class ProductDto {
  @ApiProperty({
    required: true,
    description: 'Product name',
    example: 'Dell Latitude',
  })
  @IsString({ message: 'Product title is required' })
  @IsNotEmpty({ message: 'Product title cannot be empty' })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Product name',
    example: 'Dell Latitude 16GB RAM 1TB SSD, i7 11800H CPU',
  })
  @IsString({ message: 'Product description is required' })
  @IsNotEmpty({ message: 'Product description cannot be empty' })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Product price',
    example: 11,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  price: number;

  @ApiProperty({
    required: true,
    description: 'Product images',
    example: ['/server-uploads/products/1763382867638-iphone 14 pro.jpeg'],
  })
  @IsString({
    message: 'Please provide at least one product image',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Product must have at least one image',
  })
  @IsNotEmpty({
    each: true,
    message: 'Product image urls cannot be empty',
  })
  images: string[];

  @ApiProperty({
    required: true,
    description: 'Product category id',
    example: 'cmi34do3j0009c0qlo4dijyre',
  })
  @IsString({ message: 'Category is required' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  categoryId: string;

  @ApiProperty({
    required: true,
    description: 'Product color id',
    example: 'cmi34do3j0009c0qlo4dijyre',
  })
  @IsString()
  @IsOptional()
  colorId?: string;

  @ApiProperty({
    required: true,
    description: 'Product brand id',
    example: 'cmi34do3j0009c0qlo4dijyre',
  })
  @IsString()
  @IsOptional()
  brandId?: string;
}

export class GetProductDto {
  @ApiProperty({ example: 'clx12abcx0000c0prod111', description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'MacBook Pro', description: 'Product title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'High-end laptop',
    description: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2000, description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 2200, description: 'Old price', required: false })
  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @ApiProperty({ type: [String], description: 'Product images URLs' })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    enum: EnumProductState,
    example: EnumProductState.NEW,
    description: 'Product state',
  })
  @IsEnum(EnumProductState)
  state: EnumProductState;

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

  @ApiProperty({
    example: 'categoryId123',
    description: 'Category ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'brandId123', description: 'Brand ID' })
  @IsString()
  brandId: string;

  @ApiProperty({ example: 'colorId123', description: 'Color ID' })
  @IsString()
  colorId: string;

  @ApiProperty({ example: true, description: 'Is published' })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: false, description: 'Is blocked' })
  @IsBoolean()
  isBlocked: boolean;

  @ApiProperty({ example: 0, description: 'Total views' })
  @IsNumber()
  totalViews: number;

  @ApiProperty({ example: 0, description: 'Total likes' })
  @IsNumber()
  totalLikes: number;
}

export class GetProductWithDetails extends GetProductDto {
  @ApiProperty({ type: () => GetStoreDto, required: false })
  @IsOptional()
  store?: GetStoreDto;

  @ApiProperty({ type: () => GetCategoryDto, required: false })
  @IsOptional()
  category?: GetCategoryDto;

  @ApiProperty({ type: () => GetBrandDto, required: false })
  @IsOptional()
  brand?: GetBrandDto;

  @ApiProperty({
    type: () => GetReviewWithUserDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  reviews?: GetReviewWithUserDto;

  @ApiProperty({ type: () => GetColorDto, required: false })
  @IsOptional()
  color?: GetColorDto;

  @ApiProperty({ type: () => GetUserDto, required: false })
  @IsOptional()
  user?: GetUserDto;
}

export class GetProductWithDetailsAndCount {
  @ApiProperty({
    type: () => GetProductWithDetails,
    required: false,
    isArray: true,
  })
  products: GetProductWithDetails[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}

export class GetProductWithCategory extends GetProductDto {
  @ApiProperty({ type: () => GetCategoryDto })
  category: GetCategoryDto;
}

export class GetProductWithCategoryAndBrand extends GetProductDto {
  @ApiProperty({ type: () => GetCategoryDto })
  category: GetCategoryDto;

  @ApiProperty({ type: () => GetBrandDto })
  brand: GetBrandDto;
}
