'use client';

import { useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Action, Resource, PermissionContext, UserIdentity } from '../types';
import { can as checkAbility } from '../abilities';
import { isAdmin as checkIsAdmin, isSuperAdmin as checkIsSuperAdmin } from '../abilities';

export function useAbility() {
  const { user, isLoading } = useProfile();

  const userIdentity: UserIdentity | null = user
    ? { id: user.id, role: user.role }
    : null;

  const can = useCallback(
    (action: Action, resource: Resource, context?: PermissionContext) => {
      return checkAbility(userIdentity, action, resource, context);
    },
    [userIdentity],
  );

  const isAdmin = useCallback(() => {
    return checkIsAdmin(userIdentity);
  }, [userIdentity]);

  const isSuperAdmin = useCallback(() => {
    return checkIsSuperAdmin(userIdentity);
  }, [userIdentity]);

  return { can, isAdmin, isSuperAdmin, isLoading, user };
}
