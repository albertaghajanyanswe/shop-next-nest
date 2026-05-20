import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SubscriptionService } from './subscription.service';
import { MailerController } from './mailer.controller';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Global()
@Module({
  controllers: [MailerController],
  providers: [MailerService, SubscriptionService, ConfigService, PrismaService],
  exports: [MailerService, SubscriptionService],
})
export class MailerModule {}
