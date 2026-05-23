export { Role } from './types';
export type { Resource, Action, UserIdentity, PermissionContext } from './types';

export { can, canManage, isAdmin, isSuperAdmin } from './abilities';

export { Can } from './components/Can';
export { useAbility } from './hooks/useAbility';
