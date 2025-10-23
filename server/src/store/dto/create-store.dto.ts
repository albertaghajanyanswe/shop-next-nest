import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({
    message: 'Store name is required',
  })
  title: string;

  @IsOptional()
  @IsBoolean({
    message: 'isDefaultStore must be a boolean',
  })
  isDefaultStore?: boolean;
}
