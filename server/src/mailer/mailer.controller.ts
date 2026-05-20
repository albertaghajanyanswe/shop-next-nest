import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SubscribeNewsService } from './subscribeNews.service';
import { ContactUsDto } from './dto/mailer.dto';
import {
  SubscribedEmailsDtoResponse,
  SubscribeEmailDto,
} from './dto/subscribe.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly subscribeNewsService: SubscribeNewsService,
  ) {}

  @Post('/contact-us')
  async sendSupportServiceEmail(@Body() contactUsDto: ContactUsDto) {
    return await this.mailerService.contactUsMail(contactUsDto);
  }

  @Post('/subscribe')
  @ApiOkResponse({ type: SubscribedEmailsDtoResponse })
  async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto) {
    return await this.subscribeNewsService.subscribe(subscribeEmailDto);
  }

  @Delete('/unsubscribe/:email')
  async unsubscribe(@Param('email') email: string) {
    return await this.subscribeNewsService.unsubscribe(email);
  }
}
