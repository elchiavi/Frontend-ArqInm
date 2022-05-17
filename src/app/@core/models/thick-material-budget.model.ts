import { BaseEntity } from './base-entity.model';
import { ThickMaterialDetail } from './thick-material-detail.model';
import { ThickMaterial } from './thick-material.model';

export interface ThickMaterialBudget extends BaseEntity {

    thickMaterial: ThickMaterial;
    thickMaterialDetail: ThickMaterialDetail;
    provider: string;
    budget: string;
    cant: number;
    unitOfMeasurement: string;
    unitCost: number;
    cost: number;
    description?: string;
}
