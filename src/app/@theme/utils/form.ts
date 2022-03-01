import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ArqInmError } from '../../@core/models';
import { BaseEntity } from '../../@core/models';


@Injectable({
  providedIn: 'root',
})
export class FormUtils {

  static errors = new Map<string, ArqInmError>()
    .set('USER_ALREADY_EXIT', {
      field: 'email', validation: { emailUnique: { value: '' } }, hasParameter: false,
    })
    .set('number', {
      field: 'number', validation: { numberUnique: '' }, hasParameter: false,
    })
    .set('ARTICLES_UNFINISHED', {
      field: 'error', validation: {
        articlesUnfinished:
          'No se puede marcar como terminado el análisis del producto' + '\n' +
          'porque hay artículos pendientes de revisión',
      }
      , hasParameter: false,
    })
    .set('ARTICLES_UNRELATED', {
      field: 'error', validation: {
        articlesUnrelated:
          'No se puede marcar como terminado el análisis del producto porque hay artículos' + '\n' +
          'marcados como informables para los cuales no se indicó si es ICSR u OSI',
      }
      , hasParameter: false,
    })
    .set('UNFINISHED_PRODUCTS_FOUND', {
      field: 'error', validation: {
        productNotTerminated:
          'No se puede pasar a QC porque existen productos que no se encuentran marcados como terminados',
      }
      , hasParameter: false,
    })
    .set('UNFINISHED_COUNTRIES_FOUND', {
      field: 'error', validation: {
        unfinishedCountriesFound:
          'No se puede cerrar el informe porque hay uno o más países que no se encuentran en estado Terminado',
      }
      , hasParameter: false,
    })
    .set('SAME_QC_USER', {
      field: 'error', validation: {
        sameQcUser:
          'El usuario que pasó un país a estado QC no puede pasar a estado Terminado',
        notQcUser:
          'El usuario que pasó un país a estado QC no puede marcar como Qceado un producto',
      }
      , hasParameter: false,
    })
    .set('QC_PERCENTAGE_NOT_REACHED', {
      field: 'error', validation: {
        qcPercentageNotReached:
          'No puede pasar a estado Terminado porque el porcentaje de QC es menor al 20%',
      }
      , hasParameter: false,
    })
    .set('PRODUCT_IN_USE_EXCEPTION', {
      field: 'error', validation: {
        productInUse:
          'No puede eliminar el producto porque el mismo se encuentra asignado en uno o más informes',
      }
      , hasParameter: false,
    })
    .set('PASSWORD_MISMATCH', {
      field: 'error', validation: {
        passwordMismatch:
          'Usuario y/o contraseña incorrectos',
      }
      , hasParameter: false,
    })
    .set('USER_NOT_FOUND', {
      field: 'error', validation: {
        userNotFound:
          'El Usuario no existe',
      }
      , hasParameter: false,
    }).set('SEACH_REQUEST_IN_USE_EXCEPTION', {
      field: 'error', validation: {
        seachRequestInUse: 'La expresión de busqueda ya se encuentra en uso.',
      }
      , hasParameter: false,
    });


  static handleMultipleCheckboxChange(checkboxesFormArray: FormArray, pos: number, isChecked: boolean, value: any) {
    if (isChecked) {
      checkboxesFormArray.controls[pos] = new FormControl(value);
    } else {
      checkboxesFormArray.controls[pos] = new FormControl('');
    }
  }

  static initMultipleCheckbox(checkboxesFormArray: FormArray, source: BaseEntity[], selected: BaseEntity[]) {
    for (let i = 0; i < source.length; i++) {
      const exist = selected.some(lottery => lottery.id === source[i].id);
      if (exist) {
        checkboxesFormArray.controls[i].setValue(source[i]);
      } else {
        checkboxesFormArray.controls[i].setValue('');
      }
    }
  }

  static handleFormValidationErrors(errorResponse: any): boolean {
    try {
      return 'code' in errorResponse;
    } catch (e) {
      return false;
    }
  }

  static setError(form: FormGroup, error: ArqInmError) {
    if (error.hasParameter) {
      Object.keys(error.validation).forEach(key => {
        error.validation[key].value = form.controls[error.field].value;
      });
    }
    form.get(error.field).setErrors(error.validation);
  }

  static setErrorInControl(control: AbstractControl, error: ArqInmError) {
    control.setErrors(error.validation);
  }

  static setErrorInControlWithKey(control: AbstractControl, errorKey: string, parameters: Map<string, string>) {
    const error = this.errors.get(errorKey);
    if (error.hasParameter) {
      Object.keys(error.validation[errorKey]).forEach(key => {
        error.validation[errorKey][key] = parameters.get(key);
      });
    }
    control.setErrors(error.validation);
  }

  static getErrorCustomError(httpError: HttpErrorResponse): ArqInmError {
    try {
      return this.errors.get(httpError.error.code);
    } catch (e) {
      return null;
    }
  }

  static toggleDisabledState(control: AbstractControl, isEnabled: boolean): void {
    if (isEnabled) {
      control.enable();
    } else {
      control.disable();
    }
  }
}
