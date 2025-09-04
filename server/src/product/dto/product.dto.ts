import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Product title is required' })
  @IsNotEmpty({ message: 'Product title cannot be empty' })
  title: string;

  @IsString({ message: 'Product description is required' })
  @IsNotEmpty({ message: 'Product description cannot be empty' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price cannot be empty' })
  price: number;

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

  @IsString({ message: 'Category is required' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  categoryId: string;

  @IsString({ message: 'Color is required' })
  @IsNotEmpty({ message: 'Color ID cannot be empty' })
  colorId: string;

  @IsString({ message: 'Brand is required' })
  @IsNotEmpty({ message: 'Brand ID cannot be empty' })
  brandId: string;
}
