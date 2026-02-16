import { ApiProperty } from '@nestjs/swagger';
import { EnumProductIntendedFor, EnumProductState } from '@prisma/client';
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
import { GetReviewWithUserDto } from 'src/review/dto/review.dto';
import { GetStoreDto } from 'src/store/dto/store.dto';
import { GetUserDto } from 'src/user/dto/user.dto';
import { ProductDetailDto } from './productDetail.dto';

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
    description: 'Product quantity',
    example: 3,
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsNotEmpty({ message: 'Quantity cannot be empty' })
  quantity: number;

  @ApiProperty({ example: true, description: 'Is Original' })
  @IsBoolean()
  isOriginal: boolean;

  @ApiProperty({ example: true, description: 'Is Published' })
  @IsBoolean()
  isPublished: boolean;

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

  @ApiProperty({
    required: true,
    description: 'Product details',
    example: [
      {
        key: 'RAM',
        value: '16 GB',
      },
    ],
  })
  @IsArray()
  productDetails: ProductDetailDto[];

  @ApiProperty({
    required: true,
    description: 'Product intended for',
    example: 'SALE',
    enum: EnumProductIntendedFor,
  })
  @IsEnum(EnumProductIntendedFor, {
    message: `Intended for must be one of the following values: ${Object.values(
      EnumProductIntendedFor,
    ).join(', ')}`,
  })
  intendedFor: EnumProductIntendedFor;
}

export class TotalSoldDto {
  @ApiProperty({ example: 3 })
  quantity: number;
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
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 2000, description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 2200,
    description: 'Old price',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  oldPrice?: number | null;

  @ApiProperty({ example: 3, description: 'Product quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: true, description: 'Is original' })
  @IsBoolean()
  isOriginal: boolean;

  @ApiProperty({ type: [String], description: 'Product images URLs' })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    enum: EnumProductIntendedFor,
    example: 'SALE',
    description: 'Product intended for',
  })
  @IsEnum(EnumProductIntendedFor)
  intendedFor: EnumProductIntendedFor;

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
    nullable: true,
  })
  @IsOptional()
  @IsString()
  storeId?: string | null;

  @ApiProperty({
    example: 'userId123',
    description: 'User ID',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  userId?: string | null;

  @ApiProperty({
    example: 'categoryId123',
    description: 'Category ID',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @ApiProperty({ example: 'brandId123', description: 'Brand ID', required: false, nullable: true })
  @IsOptional()
  @IsString()
  brandId?: string | null;

  @ApiProperty({ example: 'colorId123', description: 'Color ID', required: false, nullable: true })
  @IsOptional()
  @IsString()
  colorId?: string | null;

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

  @ApiProperty({
    type: () => TotalSoldDto,
    isArray: true,
    description: 'Total number of sold',
  })
  @IsOptional()
  orderItems?: TotalSoldDto[];

  @ApiProperty({ example: 3, description: 'Sold count' })
  @IsOptional()
  @IsNumber()
  soldCount?: number;
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

  @ApiProperty({
    type: () => ProductDetailDto,
    isArray: true,
    required: false,
  })
  @IsOptional()
  productDetails?: ProductDetailDto;
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
