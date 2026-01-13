import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { GetSubscriptionsDto } from './dto/subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOkResponse({ type: GetSubscriptionsDto, isArray: true })
  @Auth()
  @Get('')
  async getSettings(@CurrentUser('id') userId: string) {
    return await this.subscriptionService.getAll(userId);
  }

  @Get('by-id/:id')
  @ApiResponse({ type: GetSubscriptionsDto })
  async getById(@Param('id') id: string) {
    return this.subscriptionService.getById(id);
  }
}
