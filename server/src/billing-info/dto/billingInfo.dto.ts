import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetBillingInfoDto {
  @ApiProperty({
    example: 'bill_01HYZKLMNOP123',
    description: 'Unique billing information ID',
  })
  id: string;

  @ApiProperty({
    example: 'usr_01ABCXYZ909',
    description: 'User ID this billing info belongs to',
    required: true,
  })
  @IsString({ message: 'User ID must be a string.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: string;

  @ApiProperty({
    example: 'stripe',
    description: 'Service id',
  })
  @IsString()
  @IsOptional()
  serviceId: string;

  @ApiProperty({
    example: 'cus_01ABCXYZ909',
    description: 'Stripe Customer Id',
  })
  @IsString()
  @IsOptional()
  stripeCustomerId: string;

  @ApiProperty({
    example: 'card',
    description: 'Stripe payment method',
  })
  @IsString()
  @IsOptional()
  stripeDefaultPaymentMethod: string;

  @ApiProperty({
    example: 'clock_012r1frg55t',
    description: 'Stripe test clock id',
  })
  @IsString()
  @IsOptional()
  stripeTestClockId: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Record creation timestamp (ISO date)',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Record update timestamp (ISO date)',
  })
  updatedAt: Date;
}
