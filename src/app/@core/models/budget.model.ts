import { BaseEntity } from './base-entity.model';
import { Project } from './project.model';

export interface Budget extends BaseEntity {

    totalCost: number;
    project: Project;

}
