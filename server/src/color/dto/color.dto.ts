import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({
    message: 'Color name is required',
  })
  name: string;
  @IsString({
    message: 'Color value is required',
  })
  value: string;
}
