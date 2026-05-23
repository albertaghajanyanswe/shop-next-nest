'use client';

import { ReactNode } from 'react';
import { Action, Resource, PermissionContext } from '../types';
import { useAbility } from '../hooks/useAbility';

interface CanProps {
  action: Action;
  resource: Resource;
  context?: PermissionContext;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ action, resource, context, fallback = null, children }: CanProps) {
  const { can } = useAbility();

  if (can(action, resource, context)) return <>{children}</>;

  return <>{fallback}</>;
}
