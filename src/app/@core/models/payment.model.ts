import { BaseEntity, Budget } from './index';

export interface Payment extends BaseEntity {
    amount: number;
    period: string;
    budget: Budget;
    payDate: Date;
    description: string;
    typePayment: string;
}
