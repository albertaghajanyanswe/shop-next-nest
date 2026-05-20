import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SubscriptionService } from './subscription.service';
import { ContactUsDto } from './dto/mailer.dto';
import { SubscribeEmailDto } from './dto/subscribe.dto';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('/contact-us')
  async sendSupportServiceEmail(@Body() contactUsDto: ContactUsDto) {
    return await this.mailerService.contactUsMail(contactUsDto);
  }

  @Post('/subscribe')
  async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto) {
    return await this.subscriptionService.subscribe(subscribeEmailDto);
  }

  @Delete('/unsubscribe/:email')
  async unsubscribe(@Param('email') email: string) {
    return await this.subscriptionService.unsubscribe(email);
  }
}
