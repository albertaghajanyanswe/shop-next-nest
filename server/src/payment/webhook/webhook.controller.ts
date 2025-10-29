import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { YookassaWebhookDto } from './dto';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('yookassa')
  @HttpCode(HttpStatus.OK)
  public async handleYoomoneyWebhook(
    @Body() dto: YookassaWebhookDto,
    @Ip() ip: string,
  ) {
    console.log('\n\n\n YOOKASSA WEBHOOK');
    return await this.webhookService.handleYookassaWebhook(dto, ip);
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  public async handleStripeWebhook(@Req() req, @Headers() headers: any) {
    console.log('\n\n\n STRIPE WEBHOOK');
    return await this.webhookService.handleStripeWebhook(req, headers);
  }
}
