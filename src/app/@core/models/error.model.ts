import { ValidationErrors } from '@angular/forms';
export interface ArqInmError {
    field: string;
    validation: ValidationErrors;
    hasParameter: boolean;
}
