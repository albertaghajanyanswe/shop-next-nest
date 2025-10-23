import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getAll() {
    return this.subscriptionService.getAll();
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.subscriptionService.getById(id);
  }
}
