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
      event = res?.event as Stripe.Event;
      error = res?.error;

      console.log('\n\n\n STRIPE WEBHOOK', event.type);

      if (error) {
        throw new UnauthorizedException(error);
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    await this.stripeService.handleWebhook(event as Stripe.Event);
    return { ok: true };
    // TODO: implement processing the result
    // const result = await this.stripeService.handleWebhook(
    //   event as Stripe.Event,
    // );

    // if (!result) {
    //   return { ok: true };
    // }
    // return await this.paymentHandler.processResult(result);
  }
}
