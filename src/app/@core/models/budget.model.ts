import { BaseEntity } from './base-entity.model';
import { ProfessionalBudget } from './professional-budget.model';
import { Project } from './project.model';

export interface Budget extends BaseEntity {

    professionalBudget: ProfessionalBudget;
    totalCost: number;
    project: Project;

}
