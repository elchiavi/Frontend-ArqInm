import { BaseEntity } from './base-entity.model';
import { InstallationMaterialDetail } from './installation-material-detail.model';
import { InstallationMaterial } from './installation-material.model';

export interface InstallationMaterialBudget extends BaseEntity {

    installationMaterial: InstallationMaterial;
    installationMaterialDetail: InstallationMaterialDetail;
    provider: string;
    budget: string;
    cant: number;
    unitOfMeasurement: string;
    unitCost: number;
    cost: number;
    description?: string;
}
