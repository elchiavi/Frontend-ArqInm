import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { each } from 'lodash';


@Injectable({
  providedIn: 'root',
})
export class SharedFormService {

  public canShowFieldErrors(field: AbstractControl) {
    return !field.valid && field.touched && field.enabled;
  }

  public canShowAnyFieldError(form: FormGroup): boolean {
    for (const controlKey in form.controls) {
      if (this.canShowFieldErrors(form.controls[controlKey])) {
        return true;
      }
    }
    return false;
  }

  public touchAllFields(form: FormGroup) {
    form.markAllAsTouched();
    form.updateValueAndValidity();
    each(form.controls, (control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  public cleanAllFields(form: FormGroup) {
    form.markAsUntouched();
    each(form.controls, (control: AbstractControl) => {
      control.reset();
      control.markAsUntouched();
      control.patchValue(null);
    });
  }

}
