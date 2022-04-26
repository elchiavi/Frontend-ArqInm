import { BaseEntity } from './base-entity.model';
import { Project } from './project.model';

export interface Budget extends BaseEntity {

    totalCost: number;
    totalCostProfessional?: number;
    totalCostConstructionSupport?: number;
    totalCostManPower?: number;
    project: Project;
    arrayCosts?: Array<number>;
    arrayManPowers?: Array<string>;

}
