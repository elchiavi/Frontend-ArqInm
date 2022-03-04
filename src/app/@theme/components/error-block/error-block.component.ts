import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SharedFormValidation } from '../../utils/form.validation';

@Component({
    selector: 'ngx-error-field',
    templateUrl: './error-block.component.html',
})
export class ErrorBlockComponent {

    @Input() field: AbstractControl;
    @Input() showForUntouched: boolean;
    show = false;

    constructor(public cdRef: ChangeDetectorRef) {
    }

    get errorMessage() {
        return SharedFormValidation.getErrorMessageForControl(this.field);
    }

    showPrueba() {
        return !this.field.valid && (this.field.touched || this.showForUntouched) && this.field.enabled;
    }

    get canShow() {
        const show = this.showPrueba();
        if (show && show !== this.show) {
            this.show = show;
            this.cdRef.detectChanges();
        }
        return this.show;
    }

}
