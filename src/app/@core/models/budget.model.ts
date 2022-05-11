import { BaseEntity } from './base-entity.model';
import { Project } from './project.model';

export interface Budget extends BaseEntity {

    totalCost: number;
    totalCostProfessional: number;
    totalCostConstructionSupport: number;
    totalCostManPower: number;
    totalCostTerminationMaterial: number;
    project: Project;
    arrayCostsManPower?: Array<number>;
    arrayManPowers?: Array<string>;
    arrayCostsTerminationMaterial?: Array<number>;
    arrayTerminationMaterial?: Array<string>;

}
