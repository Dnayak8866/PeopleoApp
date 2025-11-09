import { Injectable } from '@nestjs/common';

export interface SalaryCountdownResult {
  salaryDay: number;
  daysRemaining: number;
  nextSalaryDate: string; // ISO
}

@Injectable()
export class SalaryCountdownService {
  /**
   * Calculate days remaining until next salary date.
   * salaryDay: 1-31 (if day > days in month, last day of month is used)
   */
  getCountdown(salaryDay = 1, now = new Date()): SalaryCountdownResult {
    // normalize salaryDay
    const day = Math.max(1, Math.min(31, Math.floor(salaryDay)));

    // work in server local timezone
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    // helper to get last day of a given month
    const lastDayOfMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

    // candidate this month
    const daysInThisMonth = lastDayOfMonth(year, month);
    const candidateDayThisMonth = Math.min(day, daysInThisMonth);
    const candidateDateThisMonth = new Date(year, month, candidateDayThisMonth, 0, 0, 0, 0);

    let nextSalaryDate: Date;
    if (now <= candidateDateThisMonth) {
      nextSalaryDate = candidateDateThisMonth;
    } else {
      // next month
      const nextMonth = month + 1;
      const nextMonthYear = year + Math.floor(nextMonth / 12);
      const nextMonthIndex = nextMonth % 12;
      const daysInNextMonth = lastDayOfMonth(nextMonthYear, nextMonthIndex);
      const candidateDayNextMonth = Math.min(day, daysInNextMonth);
      nextSalaryDate = new Date(nextMonthYear, nextMonthIndex, candidateDayNextMonth, 0, 0, 0, 0);
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    // calculate difference in days (fractional days rounded up if there's any remainder)
    const diffMs = nextSalaryDate.getTime() - now.getTime();
    const rawDays = Math.ceil(diffMs / msPerDay);

    return {
      salaryDay: day,
      daysRemaining: Math.max(0, rawDays),
      nextSalaryDate: nextSalaryDate.toISOString(),
    } as SalaryCountdownResult;
  }
}
