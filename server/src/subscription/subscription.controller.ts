import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiResponse } from '@nestjs/swagger';
import { GetSubscriptionDto } from './dto/subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiResponse({ type: GetSubscriptionDto, isArray: true })
  async getAll() {
    return this.subscriptionService.getAll();
  }

  @Get('by-id/:id')
  @ApiResponse({ type: GetSubscriptionDto })
  async getById(@Param('id') id: string) {
    return this.subscriptionService.getById(id);
  }
}
