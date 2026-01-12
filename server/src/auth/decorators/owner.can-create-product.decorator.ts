import { applyDecorators, UseGuards, Type } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerCanCreateProductGuard } from '../guards/owner.can-create-product';

export const AuthAndOwnerAndCanCreateProduct = (entityService: any, paramIdName: string) =>
  applyDecorators(UseGuards(JwtAuthGuard, OwnerCanCreateProductGuard(entityService, paramIdName)));