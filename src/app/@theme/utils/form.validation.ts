import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { filter, forOwn, uniq } from 'lodash';
import { PhoneNumberUtils } from './phone-number';
import { TextUtils } from './text';
import { Utils } from './utils';
export class SharedFormValidation {

  static readonly MAX_EMAIL_SIZE = 100;

  static equalToPassword(equalToFieldName: string, isReverse?: boolean) {
    return (control: AbstractControl) => {
      const passwordControl = control.root.get(equalToFieldName);

      if (!passwordControl || typeof passwordControl.value !== 'string') {
        return null;
      }

      if (isReverse) {
        if (passwordControl.value.length) {
          passwordControl.updateValueAndValidity();
        }
      } else {
        return control.value === passwordControl.value
          ? null : { mismatchPassword: true };
      }

      return null;
    };
  }

  static requiredNumberConditional(requiredToFieldName: string, min: number, max: number) {
    return (control: AbstractControl) => {
      if (!control.root.get(requiredToFieldName)) {
        return null;
      }

      if (!!control.root.get(requiredToFieldName).value) {
        if (!control.value || !control.value.toString().length) {
          return { required: true };
        }

        if (!/^\d+$/.test(control.value) || control.value < min) {
          return { minNumber: { min } };
        }

        if (!/^\d+$/.test(control.value) || control.value > max) {
          return { maxNumber: { max } };
        }
      }

      return null;
    };
  }

  static requiredValueConditional(requiredToFieldName: string) {
    return (control: AbstractControl) => {
      if (!control.root.get(requiredToFieldName)) {
        return null;
      }

      if (!!control.root.get(requiredToFieldName).value) {
        if (!control.value || !control.value.toString().length) {
          return { required: true };
        }
      }

      return null;
    };
  }

  static minNumber(min: number) {
    return (control: AbstractControl) => {

      if (!control.value?.toString().length) {
        return null;
      }

      return /^\d+$/.test(control.value) && control.value >= min
        ? null : { minNumber: { min } };
    };
  }

  static compareMinNumber(equalToFieldName: string, isReverse?: boolean) {
    return (control: AbstractControl) => {
      const minControl = control.root.get(equalToFieldName);
      if (!minControl || !minControl.value) {
        return null;
      }
      if (isReverse) {
        if (minControl.value.toString().length) {
          minControl.updateValueAndValidity();
        }
      } else {
        if (!control.value) {
          return null;
        }
        const result = parseFloat(control.value) > parseFloat(minControl.value);
        return result ? null : { minNumberExceeded: { min: minControl.value } };
      }

      return null;
    };
  }

  static maxNumber(max: number) {
    return (control: AbstractControl) => {

      if (!control.value?.toString().length) {
        return null;
      }

      return /^\d+$/.test(control.value) && control.value <= max
        ? null : { maxNumber: { max } };
    };
  }

  static compareMaxNumber(equalToFieldName: string, isReverse?: boolean) {
    return (control: AbstractControl) => {
      const maxControl = control.root.get(equalToFieldName);

      if (!maxControl || !maxControl.value) {
        return null;
      }
      if (isReverse) {
        if (maxControl.value.toString().length) {
          maxControl.updateValueAndValidity();
        }
      } else {
        if (!control.value) {
          return null;
        }
        const result = parseFloat(control.value) < parseFloat(maxControl.value);
        return result ? null : { maxNumberExceeded: { max: maxControl.value } };
      }

      return null;
    };
  }

  static maxLengthWithNewLine(max: number) {
    return (control: AbstractControl) => {

      if (!control.value || !control.value.toString().length) {
        return null;
      }

      const valueLength = control.value.length + control.value.split('\n').length - 1;
      return valueLength <= max ? null : { maxlength: { requiredLength: max } };
    };
  }

  static phoneNumber(min: number, max: number) {
    return (control: AbstractControl) => {
      this.validatePhoneNumber(control.value, min, max);
    };
  }

  static nameValidator(control: AbstractControl) {
    if (!control.value || !control.value.toString().length) {
      return null;
    }

    if (control.value.trim().length < 3) {
      return { fullNameMinChars: { min: 3 } };
    }

    if (filter(control.value.trim().split(' '), item => item.length).length < 2) {
      return { fullName: true };
    }

    return null;
  }

  static emailValidator(control: AbstractControl) {
    if (!control.value || !control.value.length || Utils.validateEmail(control.value)) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static commaSeparatedEmailsValidator(control: AbstractControl) {
    const emails = control.value.split(',');
    const emailsBySpace = control.value.trim().split(' ');

    if (emails.length !== emailsBySpace.length) {
      return { invalidEmailAddress: true };
    }

    if (emails.length) {
      for (const email of emails) {
        const emailTrimmed = email.trim();
        if (emailTrimmed) {
          if (!Utils.validateEmail(emailTrimmed)) {
            return { invalidEmailAddressExact: { value: emailTrimmed } };
          }
          if (emailTrimmed.length > SharedFormValidation.MAX_EMAIL_SIZE) {
            return {
              invalidEmailAddressSize: {
                value: emailTrimmed,
                size: SharedFormValidation.MAX_EMAIL_SIZE,
              },
            };
          }
        }
      }
    }
    return null;
  }

  static commaSeparatedPhoneNumbersValidator(min: number, max: number) {
    return (control: AbstractControl) => {
      const phones = control.value.split(',');
      let validationResult = null;
      if (phones.length) {
        for (const phone of phones) {
          const phoneTrimmed = phone.trim();
          if (phoneTrimmed) {
            const phoneValidationResult = this.validatePhoneNumber(phoneTrimmed, min, max);
            if (phoneValidationResult) {
              validationResult = phoneValidationResult;
              break;
            }
          }
        }
      }
      return validationResult;
    };
  }

  static phoneNumberValidator(min: number, max: number) {
    return (control: AbstractControl) => {
      if (!control) {
        return null;
      }

      return this.validatePhoneNumber(control.value, min, max);
    };
  }

  static phoneNumberValidatorExtended(min: number, max: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && value.length) {
        if (PhoneNumberUtils.isAnyOfValidPhoneFormats(value)
          && this.validatePhoneNumber(PhoneNumberUtils.parsePhoneNumberFormats(value), min, max) === null) {
          return null;
        } else {
          return { phoneNumberInvalid: { value } };
        }
      }
      return null;
    };
  }

  static phoneNumberValidatorExtendedMultiple(min: number, max: number) {
    return (control: AbstractControl) => {
      let resultError = null;
      const value = control.value;
      if (value && value.length) {
        value.split(',').map(item => item.trim()).forEach(item => {
          if (!item.length) {
            resultError = { phoneNumberMin: { value: item, min } };
          }
          if (!PhoneNumberUtils.isAnyOfValidPhoneFormats(item)
            || !this.validatePhoneNumber(PhoneNumberUtils.parsePhoneNumberFormats(item), min, max) === null) {
            resultError = { phoneNumberInvalid: { value } };
          }
        });
      }
      return resultError;
    };
  }

  public static validatePhoneNumber(phoneNumber, min, max) {
    if (!phoneNumber || !phoneNumber.toString().length) {
      return null;
    }

    if (this.isNonDigits(phoneNumber)) {
      return { phoneNumberDigit: { value: phoneNumber } };
    }

    const digitsFromPhoneNumber = PhoneNumberUtils.getDigits(phoneNumber);

    if (digitsFromPhoneNumber[0] === '1' || digitsFromPhoneNumber[0] === '0') {
      return { phoneNumberNotCorrect: { value: phoneNumber } };
    }

    if (digitsFromPhoneNumber.toString().length < min) {
      return { phoneNumberMin: { value: phoneNumber, min } };
    }

    if (digitsFromPhoneNumber.toString().length > max) {
      return { phoneNumberMax: { value: phoneNumber, max } };
    }

    return null;
  }

  static validatePhoneNumberFirstSymbol() {
    return (control: AbstractControl) => {
      if (control.value[0] === '1' || control.value[0] === '0') {
        return { phoneNumberNotCorrect: { value: control.value } };
      }
    };
  }

  static isNonDigits(value) {
    return /[^\d\(\)\-\. ]/g.test(value);
  }

  static digitsValidator() {
    return (control: AbstractControl) => {
      if (control.value) {
        return this.isNonDigits(control.value) ? { nonDigitsFound: true } : null;
      } else {
        return null;
      }
    };
  }

  static keywordValidator() {
    return (control: AbstractControl) => {
      if (!/^[a-z0-9_]+$/i.test(control.value)) {
        return { keywordError: { value: control.value } };
      }
      return null;
    };
  }

  static urlValidator(protocolRequired?: boolean) {
    return (control: AbstractControl) => {
      if (!control.value.length || Utils.validateUrl(control.value, protocolRequired)) {
        return null;
      } else {
        return { invalidUrl: { value: control.value } };
      }
    };
  }

  static creditCardDateValidator(monthInputName: string, yearInputName: string) {
    return (form: FormGroup) => {
      const month = form.get(monthInputName);
      const year = form.get(yearInputName);

      if (!month || !year) {
        return null;
      }

      if (month.untouched || year.untouched) {
        return null;
      }

      if (!month.value || !year.value) {
        return { required: true };
      }

      const selectedDate = new Date(year.value, +month.value - 1);
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth());

      if (selectedDate < todayDate) {
        return { ccDateExpired: true };
      }

      return null;
    };
  }

  static creditCardNumberValidator() {
    return (control: AbstractControl) => {
      if (!control.value || !control.value.length || Utils.validateCreditCardNumber(control.value)) {
        return null;
      } else {
        return { invalidCreditCardNumber: { value: control.value } };
      }
    };
  }

  static validateRecipientPhones(min: number, max: number) {
    return (control: AbstractControl) => {
      let validationResult = null;
      if (control.value && control.value.length) {
        const phoneNumbers = control.value
          .filter(item => !item.type)
          .map(item => item.text || item.id);
        if (phoneNumbers.length) {
          let firstFoundValidation = null;
          let numberOfErrors = 0;
          for (const phone of phoneNumbers) {
            const currentValidation = SharedFormValidation.validatePhoneNumber(phone, min, max);
            if (currentValidation) {
              numberOfErrors++;
              if (!firstFoundValidation) {
                firstFoundValidation = currentValidation;
              }
            }
          }
          if (numberOfErrors > 1) {
            validationResult = { multiplePhoneNumbersNotCorrect: true };
          } else if (numberOfErrors === 1) {
            validationResult = firstFoundValidation;
          }
        }
      }
      return validationResult;
    };
  }

  static validateExtract(form: FormGroup) {
    return () => {
      if (form.valid) {
        return null;
      } else {
        return { invalidExtract: true };
      }
    };
  }

  static validateDrawNumber(drawNumber: number) {
    return (control: AbstractControl) => {

      if (!control.value || !control.value.toString().length) {
        return null;
      }

      return control.value === drawNumber
        ? null : { mismatchDrawNumber: true };
    };
  }

  static groupNameRequired(control: AbstractControl) {
    if (!control.value.length) {
      return { groupNameRequired: { value: control.value } };
    } else {
      return null;
    }
  }

  static hasToBeTrue(control: AbstractControl) {
    if (control.value === true) {
      return null;
    } else {
      return { isNotTrue: { value: control.value } };
    }
  }

  static requiredToHaveValueIfNotEmpty(control: AbstractControl) {
    if (!control || !control.value) {
      return null;
    }
    return control.value.length &&
      TextUtils.replaceStandartNewLines(control.value.trim()).length ? null : { required: true };
  }

  static validateUnsupportedCharacters(controlOrText: AbstractControl) {
    return SharedFormValidation.validateUnsupportedCharactersInString(controlOrText.value);
  }

  static validateUnsupportedCharactersInString(text: string) {
    const validationRegExp = new RegExp('[^a-zA-Z0-9/ñÑáéíóúÁÉÍÓÚü\\s-]');
    if (text && typeof text === 'string') {
      const matches = text.match(validationRegExp);
      if (matches) {
        return { invalidCharactersTiny: { value: uniq(matches) } };
      }
    }
    return null;
  }

  static getErrorMessageForControl(control: AbstractControl) {
    return SharedFormValidation.getErrorMessageForValidationErrors(control.errors);
  }

  static getErrorMessageForValidationErrors(fieldErrors: ValidationErrors) {
    if (!fieldErrors) {
      return '';
    }

    let error = '';

    forOwn(fieldErrors, (value, key) => {
      switch (key) {
        case 'nonDigitsFound':
          error = 'Este campo solo puede contener números';
          break;
        case 'minlength':
          error = 'Por favor ingrese al menos ' + fieldErrors[key]['requiredLength'] + ' caracteres.';
          break;
        case 'maxlength':
          error = 'Por favor ingrese un máximo de ' + fieldErrors[key]['requiredLength'] + ' caracteres.';
          break;
        case 'mismatchPassword':
          error = 'Las contraseñas no coinciden.';
          break;
        case 'maxNumber':
          error = 'Por favor ingrese un valor menor o igual que ' + fieldErrors[key]['max'] + '.';
          break;
        case 'maxNumberExceeded':
          error = 'Por favor ingrese un valor menor que ' + fieldErrors[key]['max'] + '.';
          break;
        case 'minNumber':
          error = 'Por favor ingrese un valor mayor o igual que ' + fieldErrors[key]['min'] + '.';
          break;
        case 'minNumberExceeded':
          error = 'Por favor ingrese un valor mayor que ' + fieldErrors[key]['min'] + '.';
          break;
        case 'invalidParameters':
          error = 'No pudimos enviar el código al email ingresado, revisalo y volve a intentar.';
          break;
        case 'existCurrentCode':
          error = 'Ya te enviamos un código, si lo tenes ingresalo sino espera 10 minutos.';
          break;
        case 'codeNotMatch':
          error = 'No pudimos actualizar la contraseña, revisa los datos ingresados y volve a intentar.';
          break;
        case 'invalidPassword':
          error = 'La contraseña debe incluir al menos una mayúscula, letras y números.';
          break;
        case 'multiplePhoneNumbersNotCorrect':
          error = 'Please enter a valid 10-digit phone number that does not begin with 0 or 1.';
          break;
        case 'phoneNumberDigit':
          error = '\'' + fieldErrors[key]['value'] + '\' contains characters which are not digits.';
          break;
        case 'phoneNumberNotCorrect':
          error = `'${fieldErrors[key]['value']}' Phone number cannot begin with a 1 or a 0.`;
          break;
        case 'phoneNumberLandline':
          error = 'Please enter a valid mobile number.';
          break;
        case 'phoneNumberInvalid':
          error = 'Please enter a valid phone number.';
          break;
        case 'phoneNumberAlreadyInUse':
          error = 'Phone number already in use.';
          break;
        case 'phoneNumberExists':
          error = 'Phone number already exists in your contacts.';
          break;
        case 'phoneNumberMin':
          error = '\'' + fieldErrors[key]['value'] + '\' is less than '
            + fieldErrors[key]['min'] + ' characters long.';
          break;
        case 'phoneNumberMax':
          error = '\'' + fieldErrors[key]['value'] + '\' is more than '
            + fieldErrors[key]['max'] + ' characters long.';
          break;
        case 'required':
          error = 'Este campo es requerido.';
          break;
        case 'invalidEmailAddress':
          error = 'Ingrese un email válido.';
          break;
        case 'emailUnique':
          error = `El email ${fieldErrors[key]['value']} ya se encuentra registrado.`;
          break;
        case 'dniUnique':
          error = 'El DNI ya se encuentra registrado.';
          break;
        case 'codeUnique':
          error = 'El código ingresado ya fue registrado.';
          break;
        case 'notFound':
          error = 'No se obtuvieron resultados para la busqueda realizada.';
          break;
        case 'numberUnique':
          error = 'El número ingresado ya fue registrado.';
          break;
        case 'nameUnique':
          error = 'El nombre ingresado ya fue registrado.';
          break;
        case 'invalidUrl':
          error = 'Please enter a valid url.';
          break;
        case 'invalidUrlBackend':
          error = 'The input does not appear to be a valid URL';
          break;
        case 'invalidUrlBackend':
          error = 'The input does not appear to be a valid URL';
          break;
        case 'dripCampaignNameExists':
          error = 'Given name already exists. Please choose a different name for your campaign';
          break;
        case 'dripCampaignNameRequired':
          error = 'Value is required and can\'t be empty';
          break;
        case 'invalidEmailAddressExact':
          error = `${fieldErrors[key]['value']} is not a valid email address.`;
          break;
        case 'invalidEmailAddressSize':
          error = `${fieldErrors[key]['value']} is is more than ${fieldErrors[key]['size']} characters long.`;
          break;
        case 'invalidEmailAddressSize':
          error = `${fieldErrors[key]['value']} is is more than ${fieldErrors[key]['size']} characters long.`;
          break;
        case 'fileRequired':
          error = 'Please select a file.';
          break;
        case 'textareaRequired':
          error = 'Please enter data to a textarea.';
          break;
        case 'seachRequestInUse':
          error = 'La expresión de busqueda ya se encuentra en uso.';
          break;
        case 'ccDateExpired':
          error = 'Credit card has expired.';
          break;
        case 'invalidCreditCardNumber':
          error = 'Credit card number is invalid.';
          break;
        case 'keywordError':
          error = 'Keywords can not contain spaces or the following characters: ' +
            '?, @, ., !, [, ], {, }, -, +, #, $, %, &, \', (, ), *, /, \, :, ;, <, >, =, ^, `, |, ~';
          break;
        case 'templateNameUnique':
          error = `Template name ${fieldErrors[key]['value']} is already used.`;
          break;
        case 'phoneNumberUnique':
          error = `Phone number ${fieldErrors[key]['value']} is already used.`;
          break;
        case 'agreeToPay':
          error = 'You should agree to buy more credits.';
          break;
        case 'invalidCreditCardMonth':
          error = 'Invalid date.';
          break;
        case 'invalidDate':
          error = 'Please enter a valid date.';
          break;
        case 'invalidTime':
          error = 'Please enter a valid time.';
          break;
        case 'invalidDateTime':
          error = 'Please enter a valid date and time.';
          break;
        case 'groupNameExists':
          error = 'Group Name is already exists.';
          break;
        case 'fullName':
          error = 'Please enter your first and last name.';
          break;
        case 'fullNameMinChars':
          error = `You name must be at least ${fieldErrors[key]['min']} characters.`;
          break;
        case 'groupNameRequired':
          error = 'Please specify a name for a group';
          break;
        case 'fullName':
          error = 'Please enter your first and last name.';
          break;
        case 'fullNameMinChars':
          error = `You name must be at least ${fieldErrors[key]['min']} characters.`;
          break;
        case 'groupNameRequired':
          error = 'Please specify a name for a group';
          break;
        case 'invalidCharacters':
          error = `Please delete or change "${fieldErrors[key]['value'].join('')}"
                     to ${fieldErrors[key]['value'].length > 1 ? 'valid characters' : 'a valid character'}.`;
          break;
        case 'invalidCharactersTiny':
          error = `El caracter "${fieldErrors[key]['value']}" no es válido`;
          break;
        case 'notAvailableKeyword':
          error = 'Sorry that Keyword isn’t available please search for another one';
          break;
        case 'atLeastOnePhoneNumber':
          error = 'You must enter at least 1 valid phone number.';
          break;
        case 'nonDigitsFound':
          error = 'Por favor ingrese solo números.';
          break;
        case 'minRequiredChoices':
          error = `Seleccione al menos ${fieldErrors[key]['min']} opci${fieldErrors[key]['min'] > 1 ? 'ones' : 'ón'}.`;
          break;
        case 'everyChoiceUnique':
          error = 'Every Choice should be unique.';
          break;
        case 'noSpaceAndSpecialCharacters':
          error = 'Only alphanumeric characters are allowed.';
          break;
        case 'invalidGreaterDateInMinutes':
          error = 'Should be at least 5 minutes greater from now';
          break;
        case 'formFieldError':
          error = fieldErrors[key]['message'];
          break;
        case 'selectAtLeastOneContactField':
          error = 'Please select at least one contact field';
          break;
        default:
          error = fieldErrors[key] && typeof fieldErrors[key] === 'string'
            ? fieldErrors[key] : 'El valor ingresado es incorrecto.';
      }
    });

    return error;
  }

}
