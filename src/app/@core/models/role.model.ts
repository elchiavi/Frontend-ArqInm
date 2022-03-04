import { BaseEntity } from './base-entity.model';

export interface Role extends BaseEntity {
    name: 'USER_ROLE' | 'ADMIN_ROLE';
}
