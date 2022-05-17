import { BaseEntity } from './base-entity.model';
import { ThickMaterial } from './thick-material.model';


export interface ThickMaterialDetail extends BaseEntity {
    name: string;
    terminationMaterial: ThickMaterial;
}
