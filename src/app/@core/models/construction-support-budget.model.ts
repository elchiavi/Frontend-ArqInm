import { BaseEntity } from './base-entity.model';
import { ConstructionSupport } from './construction-support.model';

export interface ConstructionSupportBudget extends BaseEntity {

    constructionSupport: ConstructionSupport;
    budget: string;
    cost: number;
}
