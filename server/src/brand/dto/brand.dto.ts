import { IsString } from 'class-validator';

export class BrandDto {
  @IsString({
    message: 'Brand name is required',
  })
  name: string;
  @IsString({
    message: 'Brand category is required',
  })
  categoryId: string;
}
