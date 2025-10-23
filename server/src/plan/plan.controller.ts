import { Controller, Get, Param } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async getAll() {
    return this.planService.getAll();
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.planService.getById(id);
  }
}
