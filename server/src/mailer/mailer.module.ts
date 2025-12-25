import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  controllers: [MailerController],
  providers: [MailerService, ConfigService],
  exports: [MailerService],
})
export class MailerModule {}
