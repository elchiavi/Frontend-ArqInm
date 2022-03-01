import { FormArray } from '@angular/forms';
import { uniq, filter, map } from 'lodash';

export class SharedFormArrayValidation {

    static minChoiceCount(min: number) {
        return (control: FormArray) => {

            const values = filter(control.controls, item => item.value.toString().trim().length);
            if (values && values.length >= min) {
                return null;
            }

            return { minRequiredChoices: { min } };
        };
    }

    static everyChoiceUnique(minCount: number) {
        return (control: FormArray) => {

            const values = filter(control.controls, item => item.value.toString().trim().length);
            if (!values || values.length < minCount || values.length === uniq(map(values, item => item.value)).length) {
                return null;
            }

            return { everyChoiceUnique: false };
        };
    }

    static noSpaceAndNonAlphaNumeric(fieldName?: string) {
        return (control: FormArray) => {

            const pattern = new RegExp('^[a-zA-Z0-9_]+$', 'gi');

            const values = filter(control.controls, item =>
                item.value && !item.value.toString().match(pattern),
            );

            if (values && values.length) {
                return { noSpaceAndSpecialCharacters: { fieldName } };
            }
            return null;
        };
    }

}
