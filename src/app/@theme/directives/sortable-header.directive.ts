import { Directive, EventEmitter, Input, Output } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
    column: string;
    direction: SortDirection;
}

export declare interface Sortable {
    onSort({ column, direction }: SortEvent): void;
}

@Directive({
    selector: 'span[ngxSortable]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
})
export class NgxSortableHeaderDirective {

    @Input() ngxSortable: string;
    @Input() ngxEnabled: boolean;
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        if (this.ngxEnabled) {
            this.direction = rotate[this.direction];
            this.sort.emit({ column: this.ngxSortable, direction: this.direction });
        }
    }
}
