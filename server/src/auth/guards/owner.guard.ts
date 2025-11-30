import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  Inject,
} from '@nestjs/common';

export function OwnerGuard(
  entityServiceClass: any,
  paramIdName: string,
): Type<CanActivate> {
  @Injectable()
  class OwnerGuardMixin implements CanActivate {
    constructor(
      @Inject(entityServiceClass) private readonly entityService: any,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) throw new ForbiddenException();

      const id = request.params[paramIdName];
      if (!id) throw new ForbiddenException('No entity id in params');
      const entity = await this.entityService.getById(id);
      if (!entity) throw new ForbiddenException('Entity not found');

      if (user.role === 'ADMIN') return true;

      if (entity.userId !== user.id)
        throw new ForbiddenException('You do not own this entity');

      return true;
    }
  }

  return OwnerGuardMixin;
}
