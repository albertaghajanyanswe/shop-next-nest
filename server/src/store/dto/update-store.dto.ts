import { IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({
    message: 'Store description is required',
  })
  description: string;
}
