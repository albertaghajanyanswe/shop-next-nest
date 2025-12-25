import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SchedulerService {
  public constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  public async handleCronTest() {
    console.log('Cron job executed: Every 12 hours');
  }
}
