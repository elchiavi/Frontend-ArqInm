import { BaseEntity } from './base-entity.model';
import { Client } from './client.model';

export interface Project extends BaseEntity {
    name: string;
    client: Client;
    linkDrive: string;
    departure: string;
    circ: string;
    section: string;
    additionalProject: boolean;
    apple: string;
    plot: string;
    street: string;
    streetNumber: number;
    floor?: string;
    province: string;
    city: string;
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
