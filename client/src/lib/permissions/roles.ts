import { Role, Resource, Action } from './types';

type ResourceMap = Partial<Record<Resource, Action[]>>;

const rolePermissions: Record<Role, ResourceMap> = {
  [Role.USER]: {
    store: ['create', 'read', 'update', 'delete'],
    product: ['create', 'read', 'update', 'delete'],
    order: ['read'],
    category: ['create', 'read', 'update', 'delete'],
    brand: ['create', 'read', 'update', 'delete'],
    color: ['create', 'read', 'update', 'delete'],
    review: ['create', 'read', 'delete'],
    user: ['read', 'update'],
    billing: ['read'],
    subscription: ['read'],
    statistics: ['read'],
    file: ['create', 'delete'],
  },
  [Role.ADMIN]: {
    store: ['create', 'read', 'update', 'delete'],
    product: ['create', 'read', 'update', 'delete'],
    order: ['read', 'refund', 'confirm', 'distribute'],
    category: ['manage'],
    brand: ['manage'],
    color: ['manage'],
    review: ['create', 'read', 'delete'],
    user: ['read', 'update'],
    billing: ['read'],
    subscription: ['read'],
    statistics: ['read'],
    file: ['create', 'delete'],
  },
  [Role.SUPER_ADMIN]: {
    store: ['manage'],
    product: ['manage'],
    order: ['manage'],
    category: ['manage'],
    brand: ['manage'],
    color: ['manage'],
    review: ['manage'],
    user: ['manage'],
    billing: ['manage'],
    subscription: ['manage'],
    statistics: ['manage'],
    file: ['manage'],
  },
};

const ownershipBypassRoles: Partial<Record<Resource, Role[]>> = {
  store: [Role.SUPER_ADMIN],
  product: [Role.SUPER_ADMIN],
  order: [Role.SUPER_ADMIN],
  category: [Role.ADMIN, Role.SUPER_ADMIN],
  brand: [Role.ADMIN, Role.SUPER_ADMIN],
  color: [Role.ADMIN, Role.SUPER_ADMIN],
  review: [Role.SUPER_ADMIN],
};

export function getResourceActions(role: string, resource: Resource): Action[] {
  const roleKey = role as Role;
  const resourceMap = rolePermissions[roleKey];
  if (!resourceMap) return [];
  return resourceMap[resource] ?? [];
}

export function canBypassOwnership(role: string, resource: Resource): boolean {
  const roleKey = role as Role;
  const bypassRoles = ownershipBypassRoles[resource];
  if (!bypassRoles) return false;
  return bypassRoles.includes(roleKey);
}

export function isRoleElevated(role: string): boolean {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}
