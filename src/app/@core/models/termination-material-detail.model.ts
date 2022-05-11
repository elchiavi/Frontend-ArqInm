import { BaseEntity } from './base-entity.model';
import { TerminationMaterial } from './termination-material.model';


export interface TerminationMaterialDetail extends BaseEntity {
    name: string;
    terminationMaterial: TerminationMaterial;
}
