import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ColorDto {
  @ApiProperty({
    required: true,
    example: 'Black',
    description: 'Product color',
  })
  @IsString({
    message: 'Color name is required',
  })
  name: string;

  @ApiProperty({
    required: true,
    example: '#000000',
    description: 'Product color',
  })
  @IsString({
    message: 'Color value is required',
  })
  value: string;
}

export class GetColorDto {
  @ApiProperty({ example: 'clx12abcx0000c0color111', description: 'Color ID' })
  id: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'Red', description: 'Color name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Color hex value' })
  @IsString()
  value: string;

  @ApiProperty({
    example: 'storeId123',
    description: 'Store ID',
    required: false,
  })
  @IsString({ message: 'Store Id is required' })
  storeId: string;
}

export class GetColorDtoAndCount {
  @ApiProperty({
    type: () => GetColorDto,
    required: false,
    isArray: true,
  })
  colors: GetColorDto[];

  @ApiProperty({ type: Number, required: false })
  totalCount: number;
}
