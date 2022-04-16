import { BaseEntity } from './base-entity.model';
import { ManPowerSkill } from './man-power-skill.model';
import { ManPower } from './man-power.model';

export interface ManPowerBudget extends BaseEntity {

    manPower: ManPower;
    manPowerSkill: ManPowerSkill;
    budget: string;
    cost: number;
    description?: string;
}
