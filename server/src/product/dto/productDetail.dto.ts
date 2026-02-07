import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductDetailDto {
  @ApiProperty({
    example: 'clx12abcx0000c0prod111',
    description: 'Product Detail ID',
  })
  id: string;

  @ApiProperty({ example: 'RAM', description: 'Product detail name' })
  @IsString()
  key: string;

  @ApiProperty({ example: '16 GB', description: 'Product detail value' })
  @IsString()
  value: string;

  @ApiProperty({
    example: 'clx12abcx0000c0prod111',
    description: 'Associated Product ID',
  })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
