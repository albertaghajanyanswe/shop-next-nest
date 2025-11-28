import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { GetUserDto } from 'src/user/dto/user.dto';

export class ReviewDto {
  @ApiProperty({
    required: true,
    example: 'Good product',
    description: 'Email of the user',
  })
  @IsString({ message: 'Review text must be string' })
  @IsNotEmpty({ message: 'Review text is required' })
  text: string;

  @ApiProperty({
    required: true,
    example: 5,
    description: 'Review rating value',
  })
  @IsNumber({}, { message: 'Rating should be number' })
  @Min(1, { message: 'Minimum rating is 1' })
  @Max(5, { message: 'Maximum rating is 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;
}

export class GetReviewDto {
  @ApiProperty({ example: 'clx12abcx0000c0rev111', description: 'Review ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'Great product', description: 'Review text' })
  @IsString()
  text: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  rating: number;

  @ApiProperty({
    example: 'userId123',
    description: 'User ID',
    required: false,
  })
  @IsString({ message: 'User id is required' })
  userId?: string;

  @ApiProperty({
    example: 'productId123',
    description: 'Product ID',
    required: false,
  })
  @IsString({ message: 'product id is required' })
  productId?: string;

  @ApiProperty({
    example: 'storeId123',
    description: 'Store ID',
    required: false,
  })
  @IsString({ message: 'Store Id is required' })
  storeId?: string;
}

export class GetReviewWithUserDto extends GetReviewDto {
  @ApiProperty({ type: () => GetUserDto })
  user: GetUserDto;
}

export class GetReviewWithUserDtoAndCount {
  @ApiProperty({
    type: () => GetReviewWithUserDto,
    required: false,
    isArray: true,
  })
  reviews: GetReviewWithUserDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}