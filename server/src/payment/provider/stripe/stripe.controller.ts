import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { EnumSubscriptionType } from '@prisma/client';
import type { User } from '@prisma/client';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OrderDto } from 'src/order/dto/order.dto';
import { EnvVariables } from 'src/utils/constants/variables';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Post('/webhook')
  async webhook(@Req() req, @Headers() headers: any) {
    let event: Stripe.Event | undefined;
    let error: Error | undefined;
    try {
      const res = this.stripeService.constructEvent(req);
      event = res?.event;
      error = res?.error;
      if (error) {
        throw new UnauthorizedException(error);
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    if (!event) throw new BadRequestException('No event');
    console.log('\n\n webhook called event.type = ', event.type);

    switch (event.type) {
      case 'payment_method.attached':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onPaymentMethodAttached(event);
        break;
      case 'customer.subscription.updated':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onSubscriptionUpdated(event);
        break;
      case 'checkout.session.completed':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onCheckoutSessionCompleted(event);
        break;
      case 'invoice.payment_succeeded':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onInvoicePaymentSucceeded(event);
        break;
      case 'customer.subscription.deleted':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onCustomerSubscriptionDeleted(event);
        break;
      case 'customer.subscription.paused':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onCustomerSubscriptionPaused(event);
        break;
      case 'customer.subscription.resumed':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onCustomerSubscriptionResumed(event);
        break;
      case 'invoice.payment_failed':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stripeService.onInvoicePaymentFailed(event);
        break;
      default:
        throw new BadRequestException(`Unknown event type: ${event.type}`);
    }
  }

  @Auth()
  @Post('/upgrade/:planId')
  async upgrade(
    @CurrentUser('id') userId: string,
    @Param('planId') planId: EnumSubscriptionType,
    @Res() res,
  ) {
    try {
      const url = await this.stripeService.upgradeSubscription(userId, planId);
      return res.json({ url });
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to upgrade subscription',
      );
    }
  }

  @Auth()
  @Post('/cancel-upgrade')
  async cancelUpgrade(@CurrentUser('id') userId: string, @Res() res) {
    try {
      const url = await this.stripeService.cancelUpgrade(userId);
      return res.json({ url });
    } catch (err) {
      throw new BadRequestException(
        err?.message || 'Failed to cancel subscription',
      );
    }
  }

  @Auth()
  @Get('/get-management-link')
  async getManagementLink(@CurrentUser('id') userId: string, @Res() res) {
    const customer = await this.prisma.billingInfo.findUnique({
      where: { userId },
    });
    if (!customer) throw new BadRequestException('Customer not found');

    const portalSession = await this.stripeService
      .getStripe()
      .billingPortal.sessions.create({
        customer: customer.stripeCustomerId as string,
        return_url: `${this.configService.get<string>(EnvVariables.CLIENT_URL)}`,
      });
    return res.json({ url: portalSession.url });
  }

  @Auth()
  @Get('/get-subscriptions')
  async getSettings(@CurrentUser('id') userId: string) {
    if (!userId) throw new UnauthorizedException();
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId },
    });
    return subscriptions;
  }

  @Auth()
  @Get('/get-plans')
  async getPlans(@CurrentUser('id') userId: string) {
    if (!userId) throw new UnauthorizedException();
    const plans = await this.stripeService.getAvailablePlans();
    return plans;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('pay-stripe')
  @Auth()
  async checkoutStripe(
    @Body() dto: OrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.stripeService.pay(dto, userId);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('create-connect-account')
  @Auth()
  async createConnectAccountStripe(
    @CurrentUser() user: User,
  ) {
    return this.stripeService.createConnectAccountStripe(user);
  }
}
