import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { YookassaWebhookDto } from './dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('/yookassa')
  @HttpCode(HttpStatus.OK)
  public async handleYoomoneyWebhook(
    @Body() dto: YookassaWebhookDto,
    @Ip() ip: string,
  ) {
    this.logger.log('\n\n\n YOOKASSA WEBHOOK');
    return await this.webhookService.handleYookassaWebhook(dto, ip);
  }

  @Post('/stripe')
  @HttpCode(HttpStatus.OK)
  public async handleStripeWebhook(@Req() req, @Headers() headers: any) {
    this.logger.log('\n\n\n STRIPE WEBHOOK');
    return await this.webhookService.handleStripeWebhook(req, headers);
  }
}
