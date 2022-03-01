import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct {
        if (value) {
            const dp = value.trim().split('/');
            if (dp.length === 1 && this.isNumber(dp[0])) {
                return { day: this.toInt(dp[0]), month: null, year: null };
            } else if (dp.length === 2 && this.isNumber(dp[0]) && this.isNumber(dp[1])) {
                return { day: this.toInt(dp[0]), month: this.toInt(dp[1]), year: null };
            } else if (dp.length === 3 && this.isNumber(dp[0]) && this.isNumber(dp[1]) && this.isNumber(dp[2])) {
                return { day: this.toInt(dp[0]), month: this.toInt(dp[1]), year: this.toInt(dp[2]) };
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        const finalDate: string = date ? `${this.isNumber(date.day) ? this.padNumber(date.day) : ''}/
        ${this.isNumber(date.month) ? this.padNumber(date.month) : ''}/
        ${date.year}` : '';
        return finalDate.replace(/↵/g, '').split(' ').join('');
    }

    private padNumber(value: number) {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        } else {
            return '';
        }
    }

    private toInt(value: any): number {
        return parseInt(`${value}`, 10);
    }
    private isNumber(value: any): value is number {
        return !isNaN(this.toInt(value));
    }
}
