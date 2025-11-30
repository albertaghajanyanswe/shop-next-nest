
import { applyDecorators, UseGuards } from '@nestjs/common';
import { StoreOwnerGuard } from '../guards/store-owned.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
export const StoreOwner = () => UseGuards(StoreOwnerGuard);

export const AuthAndStoreOwner = () =>
  applyDecorators(UseGuards(JwtAuthGuard, StoreOwnerGuard));