import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { excludeFields } from 'src/utils/types/stripe';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  private async getAvailablePlans() {
    const model = this.prisma.plan.fields;
    const select = excludeFields(model, ['stripePriceId', 'stripeProductId']);

    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
      select,
    });
  }

  public async getAll(userId: string) {
    if (!userId) throw new UnauthorizedException();
    const plans = await this.getAvailablePlans();
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
