import { BaseEntity } from './base-entity.model';
import { Professional } from './professional.model';

export interface ProfessionalBudget extends BaseEntity {

    professional: Professional[];
    cost: number;
}
