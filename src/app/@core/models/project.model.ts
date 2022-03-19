import { BaseEntity } from './base-entity.model';
import { Client } from './client.model';

export interface Project extends BaseEntity {
    name: string;
    client: Client;
    linkDrive: string;
    cadastral: string;
    street: string;
    streetNumber: number;
    startDate: Date;
    termDays: number;
    typeProject: string;
    type: string;
    lengthArea: number;
    widthArea: number;
    totalArea?: number;
    coveredArea?: number;
    semiCoveredArea?: number;
    uncoveredArea?: number;
    waterMirror?: number;
    sidewalk?: number;
}
