import { Controller, Get, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetPlanDto } from './dto/plan.dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({
    summary: 'Get all available plans',
    description: 'Retrieve a list of all subscription plans.',
  })
  @ApiOkResponse({ type: [GetPlanDto] })
  @Get()
  async getAll() {
    return this.planService.getAll();
  }

  @ApiOperation({
    summary: 'Get plan by ID',
    description: 'Retrieve a subscription plan by its unique identifier.',
  })
  @ApiOkResponse({ type: GetPlanDto })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.planService.getById(id);
  }
}
