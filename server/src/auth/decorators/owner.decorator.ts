import { applyDecorators, UseGuards, Type } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerGuard } from '../guards/owner.guard';

export const AuthAndOwner = (entityService: any, paramIdName: string) =>
  applyDecorators(UseGuards(JwtAuthGuard, OwnerGuard(entityService, paramIdName)));