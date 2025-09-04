import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({
    message: 'Store name is required',
  })
  title: string;
}
