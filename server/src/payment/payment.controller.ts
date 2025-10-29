import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { InitSubscriptionPaymentRequest, PaymentHistoryResponse } from './dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Get payment history',
    description: 'Retrieve the order history for the authenticated user.',
  })
  @ApiOkResponse({ type: [PaymentHistoryResponse] })
  @Auth()
  @Get()
  public async getHistory(@CurrentUser('id') userId: string) {
    return await this.paymentService.getHistory(userId);
  }

  @Auth()
  @Post()
  public async initSubscription(
    @Body() dto: InitSubscriptionPaymentRequest,
    @CurrentUser() user,
  ) {
    return await this.paymentService.initSubscription(dto, user);
  }
}
