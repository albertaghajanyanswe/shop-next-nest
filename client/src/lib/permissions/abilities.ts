import { Role, Action, Resource, UserIdentity, PermissionContext } from './types';
import { getResourceActions, canBypassOwnership } from './roles';

export function can(
  user: UserIdentity | null | undefined,
  action: Action,
  resource: Resource,
  context?: PermissionContext,
): boolean {
  if (!user) return false;

  const actions = getResourceActions(user.role, resource);

  if (actions.length === 0) return false;

  if (actions.includes('manage')) return true;

  if (!actions.includes(action)) return false;

  if (context?.ownerId && action !== 'read') {
    const isOwner = context.ownerId === user.id;
    if (isOwner) return true;
    return canBypassOwnership(user.role, resource);
  }

  return true;
}

export function canManage(
  user: UserIdentity | null | undefined,
  resource: Resource,
  context?: PermissionContext,
): boolean {
  return can(user, 'manage', resource, context);
}

export function isAdmin(user: UserIdentity | null | undefined): boolean {
  if (!user) return false;
  return user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;
}

export function isSuperAdmin(user: UserIdentity | null | undefined): boolean {
  if (!user) return false;
  return user.role === Role.SUPER_ADMIN;
}
