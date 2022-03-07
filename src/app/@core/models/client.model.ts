import { BaseEntity } from './base-entity.model';

export interface Client extends BaseEntity {
    name: string;
    surname: string;
    email: string;
    dni: number;
    cuit: number;
    category: string;
    phone: number;
    enabled: boolean;
}
