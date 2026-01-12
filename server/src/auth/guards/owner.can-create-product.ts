import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export function OwnerCanCreateProductGuard(
  entityServiceClass: any,
  paramIdName: string,
): Type<CanActivate> {
  @Injectable()
  class OwnerCanCreateProductGuardMixin implements CanActivate {
    constructor(
      @Inject(entityServiceClass) private readonly entityService: any,
      private readonly prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) throw new ForbiddenException();

      const id = request.params[paramIdName];
      if (!id) throw new ForbiddenException('No entity id in params');
      const entity = await this.entityService.getById(id);
      if (!entity) throw new ForbiddenException('Entity not found');

      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;

      if (entity.userId !== user.id)
        throw new ForbiddenException('You do not own this entity');

      const productsCount = await this.prisma.product.count({
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

      console.log('\n\n userActiveSub.productLimit ', userActiveSub.productLimit);
      console.log('productsCount = ', productsCount);
      if (
        userActiveSub.productLimit &&
        productsCount >= userActiveSub.productLimit
      ) {
        throw new ForbiddenException(
          `Product limit exceeded. Limit: ${userActiveSub.productLimit}`,
        );
      }

      return true;
    }
  }

  return OwnerCanCreateProductGuardMixin;
}
