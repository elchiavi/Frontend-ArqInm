import { BaseEntity } from './base-entity.model';
import { Role } from './role.model';

export interface User extends BaseEntity {
    name: string;
    surname: string;
    email: string;
    enabled: boolean;
    roles: Role;
}
