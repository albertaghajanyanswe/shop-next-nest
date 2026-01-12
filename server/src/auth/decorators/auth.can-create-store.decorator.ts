import { applyDecorators, UseGuards, Type } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CanCreateStoreGuard } from '../guards/can-create-store';

export const AuthAndCanCreateStore = () =>
  applyDecorators(UseGuards(JwtAuthGuard, CanCreateStoreGuard()));
