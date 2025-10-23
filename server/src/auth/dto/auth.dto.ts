import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    required: false,
    example: 'John Doe',
    description: 'Name of the user',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: 'test111@yopmail.com',
    description: 'Email of the user',
  })
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'strongPassword123',
    description: 'Password of the user',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsString({ message: 'Password is required' })
  password: string;
}
export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'test1@yopmail.com',
    description: 'Email of the user',
  })
  @IsString({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '111111',
    description: 'Password of the user',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsString({ message: 'Password is required' })
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: {}, description: 'ID of the user' })
  user: User;

  @ApiProperty({ example: 'accessToken123', description: 'Access token' })
  accessToken: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: {}, description: 'ID of the user' })
  user: User;

  @ApiProperty({ example: 'accessToken123', description: 'Access token' })
  accessToken: string;
}
