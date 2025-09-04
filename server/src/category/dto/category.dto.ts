import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({
    message: 'Category title is required',
  })
  title: string;
  @IsString({
    message: 'Category description is required',
  })
  description: string;
}
