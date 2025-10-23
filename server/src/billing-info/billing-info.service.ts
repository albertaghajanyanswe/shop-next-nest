import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BillingInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.billingInfo.findUnique({
      where: { id },
    });
  }

  async getByUserId(userId: string) {
    return this.prisma.billingInfo.findUnique({
      where: { userId },
    });
  }
}
