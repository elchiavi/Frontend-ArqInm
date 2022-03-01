import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Utils {

    static validateEmail(email: string) {
        const emailRegEx = new RegExp('^[a-z0-9.!#$%&’+/=?_`\'{|}~-]+@[a-z0-9-]+(\\.[a-z0-9-]+)+$', 'i');
        return emailRegEx.test(email);
    }

    static validateUrl(url: string, protocolRequired?: boolean) {
        url = url ? url.trim() : '';
        const domainEx = new RegExp('^(https?:\\/\\/)' + (protocolRequired ? '' : '?') + // protocol
            '(([a-z\\d]+([-_]+[a-z\\d]+)*)\\.)+[a-z]{2,}' + // domain name
            '(\\:\\d+)?([\\/\\w\\.=\\-_\\?\\&\\%#~:\\[\\]\\@\\!\\$\'\\(\\)*+,;]*)?', 'i');
        if (domainEx.test(url)) {
            return true;
        }
        const ipEx = new RegExp('^(https?:\\/\\/)' + (protocolRequired ? '' : '?') +
            '((\\d{1,3}\\.){3}\\d{1,3})(\\:\\d+)?([\\/\\w\\.=\\-_\\?\\&\\%#~:\\[\\]\\@\\!\\$\'\\(\\)*+,;]*)?', 'i');
        return ipEx.test(url);
    }

    static validateCreditCardNumber(value) {
        if (/[^0-9 \-]+/.test(value) || value.length < 15) {
            return false;
        }
        let nCheck = 0;
        let nDigit = 0;
        let bEven = false;

        value = value.replace(/\D/g, '');

        for (let n = value.length - 1; n >= 0; n--) {
            const cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9;
                }
            }
            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) === 0;
    }

    static isObjectNotArray(data) {
        return data instanceof Object && !Array.isArray(data);
    }
}
