import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulerService, PrismaService],
})
export class SchedulerModule {}
