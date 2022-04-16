import { BaseEntity } from './base-entity.model';
import { ManPower } from './man-power.model';

export interface ManPowerSkill extends BaseEntity {
    name: string;
    manPower: ManPower;
}
