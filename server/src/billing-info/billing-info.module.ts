import { Module } from '@nestjs/common';
import { BillingInfoService } from './billing-info.service';
import { BillingInfoController } from './billing-info.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BillingInfoController],
  providers: [BillingInfoService, PrismaService],
})
export class BillingInfoModule {}
