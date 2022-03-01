export enum DateFormatsEnum {
    Date = 'YYYY-MM-DD',
    Time = 'HH:mm',
    DateTime = 'YYYY-MM-DD HH:mm',
    DateTimeSec = 'MM-DD-YYYY HH:mm:ss',
    DateTimeISO = 'YYYY-MM-DDTHH:mm:ss.SSS-0300', // 2018-03-02T09:55:21.000+0000
    FullDayMonthName = 'dddd, MMMM D', // Monday, February 10
    MonthDayYear = 'MMM D YYYY', // Mar 11 1990
    MonthDay = 'MMM D', // Mar 11 1990
    MonthDayYearWithComma = 'MMM D, YYYY', // Mar 11, 1990
    FullMonthDayYearWithComma = 'MMMM D, YYYY', // March 11, 1990
    FullMonthDayYear = 'MMM D YYYY', // March 11 1990
    FullDate = 'dddd, MMMM D, YYYY', // Monday, February 10, 1996
}
