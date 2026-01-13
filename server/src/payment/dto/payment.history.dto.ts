import { ApiProperty } from '@nestjs/swagger';
import { EnumOrderStatus, PaymentProvider } from '@prisma/client';
import { GetPlansDto } from 'src/plan/dto/plan.dto';

export class PaymentHistoryResponse {
  @ApiProperty({
    description: 'Payment unique ID',
    example: '3Nrfjrfr45frer',
  })
  public id: string;

  @ApiProperty({
    description: 'Amount of the order',
    example: 29.99,
  })
  public amount: number;

  @ApiProperty({
    description: 'Currency used in the order',
    example: 'USD',
  })
  public currency: string;

  @ApiProperty({
    description: 'Status of the payment order',
    example: EnumOrderStatus.SUCCEEDED,
    enum: EnumOrderStatus,
  })
  public status: EnumOrderStatus;

  @ApiProperty({
    description: 'Date and time when the order was created',
    example: '2024-01-01T12:00:00.000Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Details of the plan associated with the order',
    type: () => GetPlansDto,
    nullable: true,
  })
  public plan: GetPlansDto | null;

  @ApiProperty({
    description: 'Payment provider used for the order',
    example: PaymentProvider.STRIPE,
    enum: PaymentProvider,
  })
  public provider: PaymentProvider;
}
