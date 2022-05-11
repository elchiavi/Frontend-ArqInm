import { BaseEntity } from './base-entity.model';
import { TerminationMaterialDetail } from './termination-material-detail.model';
import { TerminationMaterial } from './termination-material.model';

export interface TerminationMaterialBudget extends BaseEntity {

    terminationMaterial: TerminationMaterial;
    terminationMaterialDetail: TerminationMaterialDetail;
    provider: string;
    budget: string;
    cant: number;
    unitOfMeasurement: string;
    unitCost: number;
    cost: number;
    description?: string;
}
