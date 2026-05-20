import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SubscribeEmailDto {
  @ApiProperty({ type: String, example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class SubscribedEmailsDtoResponse {
  @ApiProperty({ type: String, example: 'Successfuly subscribed' })
  message: string;

  @ApiProperty({ type: Boolean, example: true })
  success: boolean;
}
  