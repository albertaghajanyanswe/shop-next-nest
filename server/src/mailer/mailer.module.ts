import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SubscribeNewsService } from './subscribeNews.service';
import { MailerController } from './mailer.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Global()
@Module({
  controllers: [MailerController],
  providers: [
    MailerService,
    SubscribeNewsService,
    ConfigService,
    PrismaService,
  ],
  exports: [MailerService, SubscribeNewsService],
})
export class MailerModule {}
