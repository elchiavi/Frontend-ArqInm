import { BaseEntity } from './base-entity.model';

export interface MultiProject extends BaseEntity {
    name: string;
    startDate: Date;
}
