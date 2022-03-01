export class NumberUtils {

  static get ONLY_DIGITS_REGEXP() {
    return /\d+/g;
  }

  static get DECIMAL_REGEXP() {
    return /[\d]{1,3}[\,\.]{0,1}[\d]{0,3}/gm;
  }

  static onFlyFormatNumber(value, length?: number): string {
    if (value) {
      const digitsFromValue = NumberUtils.getDigits(value.toString());
      if (digitsFromValue) {
        value = NumberUtils.formatNumber(digitsFromValue, length);
      } else {
        return '';
      }
    }
    return value;
  }

  /**
   * Get only digits from string
   */
  static getDigits(inputStr: string): string {
    const match = inputStr.toString().match(NumberUtils.ONLY_DIGITS_REGEXP);
    return match ? match.join('') : '';
  }

  static formatNumber(value: any, length?: number): string {
    if (typeof value === 'number') {
      value = value.toString();
    }

    if (typeof value === 'string') {
      if (!length || value.length <= length) {
        return value;
      } else {
        return value.substring(0, value.length - 1);
      }
    }
    return '';
  }

  /**
   * Get only digits from string
   */
  static getDecimalDigits(inputStr: string): string {
    const match = inputStr.toString().match(NumberUtils.DECIMAL_REGEXP);
    return match ? match.join('') : '';
  }

  static onFlyFormatDecimal(value): string {
    if (value) {
      const digitsFromValue = NumberUtils.getDecimalDigits(value.toString());
      if (digitsFromValue) {
        value = NumberUtils.formatDecimal(digitsFromValue);
      } else {
        return '';
      }
    }
    return value;
  }

  static formatDecimal(value: any): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (typeof value === 'string') {
      return value.replace(',', '.');
    }
    return '';
  }

  static onFlyFormatPercentage(value): string {
    if (value) {
      const digitsFromValue = NumberUtils.getDecimalDigits(value.toString());
      if (digitsFromValue) {
        value = NumberUtils.formatPercentage(digitsFromValue);
      } else {
        return '';
      }
    }
    return value;
  }


  static formatPercentage(value: any): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (value > 100) {
      if (value.includes('.')) {
        const pos = value.indexOf('.');
        return `${value.slice(0, pos - 1)}${value.slice(pos)}`;
      }
      return value.substring(0, value.length - 1);
    }

    if (typeof value === 'string') {
      if (value.length <= 6) {
        return value.replace(',', '.');
      } else {
        return value.substring(0, value.length - 1);
      }
    }
    return '';
  }
}
