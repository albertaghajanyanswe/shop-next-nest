import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storeId = request.params.storeId;

    if (!user) throw new ForbiddenException();

    if (user.role === 'ADMIN') return true;

    if (user.storeId === storeId) return true;

    throw new ForbiddenException('You do not have access to this store');
  }
}
