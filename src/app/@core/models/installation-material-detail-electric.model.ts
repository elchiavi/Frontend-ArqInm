import { BaseEntity } from './base-entity.model';
import { InstallationMaterialDetail } from './installation-material-detail.model';


export interface InstallationMaterialDetailElectric extends BaseEntity {
    name: string;
    installationMaterialDetail: InstallationMaterialDetail;
}
