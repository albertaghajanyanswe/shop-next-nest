import { ApiProperty } from "@nestjs/swagger";

export class PlanResponse {
  @ApiProperty({
    description: 'Unique identifier for the plan',
    example: '2Nrfjrfr45frer',
  })
  public id: string;

    @ApiProperty({
    description: 'Name of the plan',
    example: 'Premium',
  })
  public title: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: 'Best plan for growing businesses',
  })
  public description: string;

  @ApiProperty({
    description: 'Monthly price of the plan in USD',
    example: 29.99,
  })
  public monthlyPrice: number;

  @ApiProperty({
    description: 'Annual price of the plan in USD',
    example: 299.99,
  })
  public annualPrice: number;

  @ApiProperty({
    description: 'Store limit for the plan',
    example: 10,
  })
  public storeLimit: number | null;

  @ApiProperty({
    description: 'Product limit for the plan',
    example: 100,
  })
  public productLimit: number | null;

  @ApiProperty({
    description: 'Features included in the plan',
    example: [
      'Unlimited access to content',
      'Priority customer support',
      'Advanced analytics',
    ],
    isArray: true,
  })
  public features: string[];

  @ApiProperty({
    description: 'Indicates if the plan is marked as popular',
    example: true,
  })
  public isPopular: boolean;
}