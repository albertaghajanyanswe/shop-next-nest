import { ApiProperty } from '@nestjs/swagger';

export class ContactUsDto {
  @ApiProperty({ type: String, example: 'John Doe' })
  name: string;
  @ApiProperty({ type: String, example: 'test@yopmail.com' })
  email: string;
  @ApiProperty({
    type: String,
    example: 'Hello, I would like to know more about...',
  })
  message: string;
}
