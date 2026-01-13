import { Controller, Get, Param } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetPlansDto } from './dto/plan.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Auth()
  @ApiOkResponse({ type: GetPlansDto, isArray: true })
  @Get('')
  async getPlans(@CurrentUser('id') userId: string) {
    return await this.planService.getAll(userId);
  }

  @ApiOperation({
    summary: 'Get plan by ID',
    description: 'Retrieve a subscription plan by its unique identifier.',
  })
  @ApiOkResponse({ type: GetPlansDto })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.planService.getById(id);
  }
}
