import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  CancelSubscriptionRequest,
  DistributeOrderDto,
  DistributeOrderItemDto,
  InitSubscriptionPaymentRequest,
} from './dto';
import { OrderDto } from 'src/order/dto/order.dto';
import type { User } from '@prisma/client';
import { RefundOrderDto, RefundOrderItemDto } from './dto/refund.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentService: PaymentService) {}

  @Auth()
  @Post('/sub-upgrade')
  public async initSubscription(
    @Body() dto: InitSubscriptionPaymentRequest,
    @CurrentUser() user: User,
    @Res() res,
  ) {
    const upgradeRes = await this.paymentService.initSubscription(dto, user);
    this.logger.log('\n\n UPGRADE SUBSCRIPTION RESULT = ', upgradeRes);
    return res.json({ url: upgradeRes });
  }

  @Auth()
  @Post('/sub-cancel-upgrade')
  async cancelUpgrade(
    @Body() dto: CancelSubscriptionRequest,
    @CurrentUser('id') userId: string,
    @Res() res,
  ) {
    try {
      const url = await this.paymentService.cancelUpgrade(userId);
      return res.json({ url });
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to cancel subscription',
      );
    }
  }

  @Auth()
  @Get('/sub-get-management-link')
  async getManagementLink(@CurrentUser('id') userId: string, @Res() res) {
    return await this.paymentService.getManagementLink(userId, res);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/buy-product')
  @Auth()
  async checkoutStripe(
    @Body() dto: OrderDto,
    @CurrentUser('id') userId: string,
  ) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return this.paymentService.pay(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/create-connect-account')
  @Auth()
  async createConnectAccountStripe(@CurrentUser() user: User) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return this.paymentService.createConnectAccountStripe(user);
  }

  @Auth()
  @Get('/create-login-link')
  async createLoginLink(@CurrentUser() user: User) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return await this.paymentService.createLoginLink(user);
  }

  @Auth()
  @ApiOkResponse({ type: DistributeOrderDto })
  @Post('/order/distribute-funds')
  async orderPayToCustomer(
    @CurrentUser() user: User,
    @Body() dto: { orderId: string },
  ) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return await this.paymentService.orderPayToCustomer(user, dto.orderId);
  }
  @Auth()
  @ApiOkResponse({ type: DistributeOrderItemDto })
  @Post('/orderItem/distribute-funds')
  async orderItemPayToCustomer(
    @CurrentUser() user: User,
    @Body() dto: { orderItemId: string },
  ) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return await this.paymentService.orderItemPayToCustomer(
      user,
      dto.orderItemId,
    );
  }

  @Auth()
  @ApiOkResponse({ type: RefundOrderDto })
  @Post('/order/refund')
  async refundOrder(
    @CurrentUser() user: User,
    @Body() dto: { reason?: string; orderId: string },
  ) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return this.paymentService.refundOrder(user, dto.orderId, dto.reason);
  }

  @Auth()
  @ApiOkResponse({ type: RefundOrderItemDto })
  @Post('/orderItem/refund')
  async refundOrderItem(
    @CurrentUser() user: User,
    @Body() dto: { reason?: string; orderItemId: string },
  ) {
    if (process.env.ALLOW_PURCHASE !== 'true') {
      throw new BadRequestException('Purchase products not allowed.');
    }
    return this.paymentService.refundOrderItem(
      user,
      dto.orderItemId,
      dto.reason,
    );
  }

  @Auth()
  @Post('/simulate-test-clock')
  async simulateStripeTestClockAdvance(
    @Body() dto: { numberOfDays: number },
    @CurrentUser('id') userId: string,
    @Res() res,
  ) {
    try {
      const result = await this.paymentService.simulateStripeTestClockAdvance(
        userId,
        dto.numberOfDays,
      );
      return res.json({ ok: true });
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to simulate stripe test clock',
      );
    }
  }
}
