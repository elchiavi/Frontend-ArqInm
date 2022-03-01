import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateUtils } from './date';
import { DateFormatsEnum } from './date-formats.enum';

@Injectable({
    providedIn: 'root',
})
export class CustomDateAdapter {

    fromModel(value: Date): NgbDateStruct {
        if (!value) {
            return null;
        }
        const date = value.toLocaleString().substring(0, 10).replace(/-/g, '\/');
        const dateString = DateUtils.formatOutput(new Date(date), DateFormatsEnum.Date);
        const parts = dateString.split('-');
        return { year: +parts[0], month: +parts[1], day: +parts[2] };
    }

    toModel(date: NgbDateStruct): string {
        return date ? date.year + '-' + ('0' + date.month).slice(-2)
            + '-' + ('0' + date.day).slice(-2) : null;
    }
}
