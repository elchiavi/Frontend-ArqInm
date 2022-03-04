import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'ngx-modal-confirm',
    templateUrl: './modal-confirm.component.html',
    styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent {

    @Input() title;
    @Input() message;

    constructor(public ref: NbDialogRef<ModalConfirmComponent>) {}

}
