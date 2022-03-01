export class TextUtils {

    public static readonly NEWLINE_CRLF = '\r\n';

    public static readonly URL_REGEX_STRING = '(https?:\\/\\/)?' + // protocol (optional)
        '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?([\\/\\w\\.=\\-_\\?\\&\\%#~:\\[\\]\\@\\!\\$\'\\(\\)*+,;]*)';

    public static readonly SHORT_URL_TAG_REGEXP_STRING = '{#URL="[^{]+"#}';

    public static readonly SHORT_URL_LENGTH = 21;

    public static get NEWLINE_CRLF_REGEXP() {
        return /\r\n/g;
    }

    public static get NEWLINE_ALL_REGEXP() {
        return /\r\n|\n|\r/g;
    }

    static get ONLY_LETTER_REGEXP() {
        return /([A-Z | a-z])/g;
    }

    /**
     * Replace all types of newlines '\n' '\r' to a standart '\r\n'
     *
     * Multiple OS uses different characters to separate lines
     * Linux/Unix text files use the line feed (CharCode 10 - '\n')
     * Dos prompts also correctly interpret line feeds
     * Macs use carriage returns (CharCode 13 - '\r')
     * Windows uses CRLF - a carriage return followed by a line feed, two characters '\r\n'
     * CRLF is also a standart for transfer new lines through HTTP
     */
    public static replaceStandartNewLines(text: string): string {
        if (TextUtils.NEWLINE_ALL_REGEXP.test(text)) {
            return text.replace(TextUtils.NEWLINE_ALL_REGEXP, TextUtils.NEWLINE_CRLF);
        }
        return text;
    }

    public static toCapitalCase(text: string): string {
        if (typeof text !== 'string') {
            return '';
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    public static formatBranchCode(text: string): string {
        if (typeof text !== 'string') {
            return '';
        }

        const onlyLetter = text.match(TextUtils.ONLY_LETTER_REGEXP);
        if (!onlyLetter) {
            return '';
        }

        const upperCase = text.toUpperCase();
        if (upperCase.length > 1) {
            return upperCase[0];
        }
        return upperCase;
    }

}

