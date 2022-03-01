export class PhoneNumberUtils {

    public static readonly PHONE_NUMBER_TEXT_MASK = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/,
        /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    static get ALL_VALID_PHONE_FORMATS_REGEXP() {
        return /^(\([23456789]\d{2}\)|[23456789]\d{2})[-. ]?(\d{3}[-. ]?\d{2}[-]?\d{2}|\d{2}[-]?\d{2}[-. ]?\d{3})$/g;
    }

    static get ONLY_DIGITS_REGEXP() {
        return /\d+/g;
    }

    static get PARTIAL_PHONE_NUMBER_REGEXP() {
        return /^\(*\d+\)* *\d+([\-\. ]*\d*)*$/g;
    }

    static get STRING_WITHOUT_DELIMITERS_REGEXP() {
        return /[^\(\)\-\. ]+/g;
    }

    static get ROUND_BRACES_REGEXP() {
        return /\(|\)/g;
    }

    /**
     * Remove phoneNumber delimiters from string.
     *
     * @example (12w) ww3-78.6x -> 12www3786x
     */
    static removePhoneNumberDelimiters(text: string): string {
        const textWithoutDelimiters = text.match(PhoneNumberUtils.STRING_WITHOUT_DELIMITERS_REGEXP);
        if (textWithoutDelimiters) {
            return textWithoutDelimiters.join('');
        }
        return '';
    }

    /**
     * Check if string is a partial phone number, i.e. contains only digits and delimiters
     *
     * @example (123) 44-56.7- true
     * @example (123) ww false
     */
    static isPartialPhoneNumber(value): boolean {
        return PhoneNumberUtils.PARTIAL_PHONE_NUMBER_REGEXP.test(value.toString());
    }

    /**
     * Check if string represents a full phoneNumber in a valid format
     */
    static isAnyOfValidPhoneFormats(phoneNumberInput: string): boolean {
        return PhoneNumberUtils.ALL_VALID_PHONE_FORMATS_REGEXP.test(phoneNumberInput);
    }

    static getRegExForMask(maskArray: Array<string | RegExp>): RegExp {
        let regEx = '';
        maskArray.forEach((mask) => {
            if (mask instanceof RegExp) {
                let maskSource = mask.source;
                if (maskSource.indexOf('[') > -1) {
                    maskSource = maskSource.replace('[', '').replace(']', '');
                }
                regEx = regEx + '[' + maskSource + '_]';
            } else {
                regEx = regEx + '[' + mask + '_]';
            }
        });
        return new RegExp(regEx);
    }

    /**
     * Retrieve only digits from phoneNumberMask representing valid phoneNumber.
     * Otherwise do nothing.
     */
    static parsePhoneNumberMask(phoneNumberMask: string): string {
        if (PhoneNumberUtils.getRegExForMask(PhoneNumberUtils.PHONE_NUMBER_TEXT_MASK).test(phoneNumberMask)) {
            const digitGroups = phoneNumberMask.match(PhoneNumberUtils.ONLY_DIGITS_REGEXP);
            if (digitGroups) {
                return digitGroups.join('');
            }
        }
        return phoneNumberMask;
    }

    /**
     * Retrieve only digits from string representing valid phoneNumber.
     * Otherwise do nothing.
     */
    static parsePhoneNumberFormats(phoneNumberInput: string): string {
        if (PhoneNumberUtils.isAnyOfValidPhoneFormats(phoneNumberInput)) {
            const digitsMatch = phoneNumberInput.match(PhoneNumberUtils.ONLY_DIGITS_REGEXP);
            return digitsMatch ? digitsMatch.join('') : '';
        } else {
            return phoneNumberInput;
        }
    }

    /**
     * Remove '1' from the beginning of the string if it is a first character
     */
    static adjustPhoneNumber(value: any): string {
        if (value && value.toString().length === 11) {
            return value.toString().replace(/^1/, '');
        }
        return value;
    }

    /**
     * Automatically converts input string to a valid partial date format
     * Removes characters, adds standart delimiters, leaves up to 10 first digits
     *
     * @example '3322445' -> '(332) 244-5'
     * @example '33x224x45x5x6x677' -> '(332) 244-5566'
     */

    static onFlyFormatPhoneNumber(value): string {
        if (value) {
            const digitsFromValue = PhoneNumberUtils.getDigits(value.toString());
            if (digitsFromValue) {
                value = PhoneNumberUtils.formatNumber(digitsFromValue, 10);
            } else {
                return '';
            }
        }
        return value;
    }

    static formatNumber(phone: any, length: number): string {
        if (typeof phone === 'number') {
            phone = phone.toString();
        }
        if (typeof phone === 'string') {
            if (phone.length <= length) {
                return phone;
            } else {
                return phone.substring(0, length);
            }
        }
        return '';
    }

    /**
     * Formats an input string to a valid proneNumber format
     * Can cut off characters above the 10-characters-number-format limit
     *
     * @param phone input to try to format
     * @param cutOverflow provide true if you need to cut string down to 10-characters-number-format
     *
     * @example '123www444555666www' -> '(123) www-4445'
     */
    static formatPhoneNumber(phone: any, cutOverflow?: boolean): string {
        if (typeof phone === 'number') {
            phone = phone.toString();
        }
        if (typeof phone === 'string') {
            const rawPhone = PhoneNumberUtils.removePhoneNumberDelimiters(phone);
            if (rawPhone.length === 10) {
                return `(${rawPhone.substr(-10, 3)}) ${rawPhone.substr(-7, 3)}-${rawPhone.substr(-4)}`;
            }
            let formattedNumber = '';
            if (rawPhone.length < 3) {
                return rawPhone;
            }
            if (rawPhone.length > 2) {
                formattedNumber += `(${rawPhone.substr(0, 3)})`;
            }
            if (rawPhone.length > 3) {
                formattedNumber += ` ${rawPhone.substr(3, 3)}`;
            }
            if (rawPhone.length > 6) {
                formattedNumber += `-${rawPhone.substr(6, cutOverflow ? 4 : undefined)}`;
            }
            return formattedNumber;
        }
        return '';
    }

    /**
     * Get only digits from string
     */
    static getDigits(inputStr: string): string {
        const match = inputStr.toString().match(PhoneNumberUtils.ONLY_DIGITS_REGEXP);
        return match ? match.join('') : '';
    }

    /**
     * Add 1 to the start of the phone number if it has 10 digits
     */
    static adjustTo11DigitsFormat(phone: string): string {
        if (phone && phone.length === 10) {
            return '1' + phone;
        }

        return phone;
    }
}
