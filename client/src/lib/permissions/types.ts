export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export type Resource =
  | 'store'
  | 'product'
  | 'order'
  | 'category'
  | 'brand'
  | 'color'
  | 'review'
  | 'user'
  | 'billing'
  | 'subscription'
  | 'statistics'
  | 'file';

export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'publish'
  | 'block'
  | 'refund'
  | 'confirm'
  | 'distribute';

export interface UserIdentity {
  id: string;
  role: string;
}

export interface PermissionContext {
  ownerId?: string | null;
  storeId?: string | null;
}

export type PermissionCheck = (
  user: UserIdentity,
  action: Action,
  resource: Resource,
  context?: PermissionContext
) => boolean;

export interface RoleDefinition {
  label: string;
  level: number;
}
