import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export function CanCreateStoreGuard(): Type<CanActivate> {
  @Injectable()
  class CanCreateStoreGuardMixin implements CanActivate {
    constructor(
      private readonly prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) throw new ForbiddenException();

      const storesCount = await this.prisma.store.count({
        where: {
          userId: user.id,
        },
      });

      const currUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          subscription: {
            select: {
              storeLimit: true,
              productLimit: true,
              status: true,
            },
          },
        },
      });

      const userActiveSub = currUser?.subscription.find(
        (sub) => sub.status === 'ACTIVE',
      );

      if (!userActiveSub) {
        throw new ForbiddenException('Subscription not found');
      }

      if (userActiveSub.storeLimit && storesCount >= userActiveSub.storeLimit) {
        throw new ForbiddenException(
          `Store limit exceeded. Limit: ${userActiveSub.storeLimit}`,
        );
      }

      return true;
    }
  }

  return CanCreateStoreGuardMixin;
}
