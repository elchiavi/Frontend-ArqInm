import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateFormatsEnum } from './date-formats.enum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export const SERVER_TIMEZONE_OFFSET = -5;

@Injectable({
    providedIn: 'root',
})
export class DateUtils {

  static validateDate(dateString: string) {
    const date = DateUtils.parseDateString(dateString, DateFormatsEnum.Date);
    return DateUtils.isValidDateFormat(dateString) && date instanceof Date;
  }

  static parseDateString(dateString: string, inputFormat?: DateFormatsEnum): Date {
    return moment(dateString, inputFormat || DateFormatsEnum.Date).toDate();
  }

  static formatOutput(date: Date, outputFormat?: DateFormatsEnum): string {
    return moment(date).format(outputFormat || DateFormatsEnum.Date);
  }

  static formatNgbDateToString(date: NgbDate, outputFormat?: DateFormatsEnum) {
    const newDate = new Date(date.year, date.month - 1, date.day, 0, 0, 0);
    return moment(newDate).format(outputFormat || DateFormatsEnum.Date);
  }

  static formatNgbDateToDate(date: NgbDate) {
    return new Date(date.year, date.month - 1, date.day, 0, 0, 0);
  }

  static addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  static formatStringToNgbDate(dateString: string): NgbDate {
    const parts = dateString.split('-');
    return new NgbDate(+parts[0], +parts[1], +parts[2]);
  }

  static formatDateToNgbDate(date: Date): NgbDate {
    return new NgbDate(+date.getFullYear(), +date.getMonth() + 1, +date.getDate());
  }

  static isAfter(d1: Date, d2: Date): boolean {
    return moment(d1).isAfter(d2);
  }

  static isBefore(d1: Date, d2: Date): boolean {
    return moment(d1).isBefore(d2);
  }

  static isBetween(d1: Date, d2: Date, d3: Date): boolean {
    return moment(d1).isBetween(d2, d3);
  }

  static isBeforeTime(t1: string, t2: string): boolean {
    const d1 = new Date().setHours(parseInt(t1.substring(0, 2), 10), parseInt(t1.substring(3, 5), 10));
    const d2 = new Date().setHours(parseInt(t2.substring(0, 2), 10), parseInt(t2.substring(3, 5), 10));
    return moment(d1).isBefore(d2);
  }

  static isAfterTime(t1: string, t2: string): boolean {
    const d1 = new Date().setHours(parseInt(t1.substring(0, 2), 10), parseInt(t1.substring(3, 5), 10));
    const d2 = new Date().setHours(parseInt(t2.substring(0, 2), 10), parseInt(t2.substring(3, 5), 10));
    return moment(d1).isAfter(d2);
  }

  static startDate(date: string): string {
    return `${date}T00:00:00-03:00`;
  }

  static endDate(date: string): string {
    return `${date}T23:59:59-03:00`;
  }


  // Validates that the input string is a valid date formatted as "mm-dd-yyyy"
  static isValidDateFormat(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return false;
    }
    // Parse the date parts to integers
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
      return false;
    }
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29;
    }
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }
  // Validates that the input string is a valid time formatted as "hh:mm a"
  static isValidTimeFormat(timeString) {
    // First check for the pattern
    if (!/^\d{1,2}:\d{2} (am|pm|AM|PM)$/.test(timeString)) {
      return false;
    }

    // Parse the time parts to integers
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1].split(' ')[0], 10);

    // Check the ranges of hours and minutes
    return !(hours > 12 || minutes > 59);
  }

  static validateDateTime(dateTimeString: string) {
    if (!/^\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2} (am|pm|AM|PM)$/.test(dateTimeString)) {
      return false;
    }
    const dateString = dateTimeString.match(/\d{1,2}-\d{1,2}-\d{4}/)[0];
    const timeString = dateTimeString.match(/\d{1,2}:\d{2} (am|pm|AM|PM)/)[0];
    return DateUtils.validateDate(dateString) && DateUtils.isValidTimeFormat(timeString);
  }
}
