import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const plans = await this.prisma.plan.findMany({
      orderBy: { monthlyPrice: 'asc' },
    });
    return plans;
  }

  async getById(planId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found.');
    }
    return plan;
  }
}
