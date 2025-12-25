import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ContactUsDto } from './dto/mailer.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/contact-us')
  async sendSupportServiceEmail(@Body() contactUsDto: ContactUsDto) {
    return await this.mailerService.contactUsMail(contactUsDto);
  }
}
