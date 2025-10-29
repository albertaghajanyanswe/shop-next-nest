import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { StripeService } from '../provider/stripe/stripe.service';
import Stripe from 'stripe';
import { YoomoneyService } from '../provider/yoomoney/yoomoney.service';
import { YookassaWebhookDto } from './dto';
import { PaymentHandler } from '../payment.handler';
import { ok } from 'assert';

@Injectable()
export class WebhookService {
  public constructor(
    private readonly paymentHandler: PaymentHandler,
    private readonly stripeService: StripeService,
    private readonly yoomoneyService: YoomoneyService,
  ) {}

  public async handleYookassaWebhook(dto: YookassaWebhookDto, ip: string) {
    // prevent unauthorized access  when called webhook endpoint manually
    const checked = this.yoomoneyService.verifyWebhookIp(ip);
    if (!checked) {
      throw new UnauthorizedException('Invalid Yookassa IP address');
    }

    const result = await this.yoomoneyService.handleWebhook(dto);
    return await this.paymentHandler.processResult(result);
  }

  public async handleStripeWebhook(req: any, headers: any) {
    let event: Stripe.Event | undefined;
    let error: Error | undefined;
    try {
      // prevent unauthorized access when called webhook endpoint manually
      const res = this.stripeService.constructEvent(req);
      event = res?.event;
      error = res?.error;
      if (error) {
        throw new UnauthorizedException(error);
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    const result = await this.stripeService.handleWebhook(
      event as Stripe.Event,
    );

    if (!result) {
      return { ok: true };
    }
    return await this.paymentHandler.processResult(result);

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
}
