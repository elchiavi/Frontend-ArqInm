import { BaseEntity } from './base-entity.model';
import { InstallationMaterialDetailElectric } from './installation-material-detail-electric.model';
import { InstallationMaterialDetail } from './installation-material-detail.model';
import { InstallationMaterial } from './installation-material.model';

export interface InstallationMaterialBudget extends BaseEntity {

    installationMaterial: InstallationMaterial;
    installationMaterialDetail: InstallationMaterialDetail;
    installationMaterialDetailElectric?: InstallationMaterialDetailElectric;
    provider: string;
    budget: string;
    cant: number;
    unitOfMeasurement: string;
    unitCost: number;
    cost: number;
    description?: string;
}
