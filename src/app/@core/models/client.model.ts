import { BaseEntity } from './base-entity.model';

export interface Client extends BaseEntity {
    name: string;
    surname: string;
    fullName: string;
    businessName?: string;
    email: string;
    dni: number;
    cuit: number;
    category: string;
    street: string;
    streetNumber: number;
    floor?: string;
    province: string;
    city: string;
    phone: number;
    enabled: boolean;
}
