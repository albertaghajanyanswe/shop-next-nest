import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  public constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  public async handleCronTest() {
    this.logger.log('Cron job executed: Every 12 hours');
  }
}
