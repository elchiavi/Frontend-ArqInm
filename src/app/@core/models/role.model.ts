import { BaseEntity } from './base-entity.model';

export interface Role extends BaseEntity {
    name: 'Administrador' | 'Auxiliar';
}
