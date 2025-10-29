import { Module } from '@nestjs/common';
import { YoomoneyService } from './yoomoney.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [],
  providers: [YoomoneyService, PrismaService],
  exports: [YoomoneyService],
})
export class YoomoneyModule {}
