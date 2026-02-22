import { ApiProperty } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { GetUserDto } from 'src/user/dto/user.dto';

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

  @ApiProperty({
    example: 'Armenia',
    description: 'User country',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: 'Erevan',
    description: 'User city',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Shinararneri 7/23',
    description: 'User address',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '+37495898795',
    description: 'Store phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '2019',
    description: 'User postal code',
    required: false,
  })
  @IsString()
  @IsOptional()
  postalCode?: string;
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

export class AuthResponseDto {
  @ApiProperty({
    type: () => GetUserDto,
    example: {},
    description: 'ID of the user',
  })
  user: User;

  @ApiProperty({ example: 'accessToken123', description: 'Access token' })
  accessToken: string;
}
