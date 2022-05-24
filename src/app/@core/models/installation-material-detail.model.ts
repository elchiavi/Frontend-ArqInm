import { BaseEntity } from './base-entity.model';
import { InstallationMaterial } from './installation-material.model';


export interface InstallationMaterialDetail extends BaseEntity {
    name: string;
    installationMaterial: InstallationMaterial;
}
