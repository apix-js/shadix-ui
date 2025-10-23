import {
    addMonths,
    differenceInCalendarDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import type {
    CalendarDay,
    DateRange,
    TimeFormat,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

// calendar grid days
export const generateCalendarDays = (month: Date): CalendarDay[] => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const weekStart = startOfWeek(monthStart);
    const weekEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((date) => ({
        date,
        isCurrentMonth: isSameMonth(date, month),
        isToday: isToday(date),
        isSelected: false,
        isRangeStart: false,
        isRangeEnd: false,
        isInRange: false,
        isDisabled: false,
    }));
};

// date comparison
export const isSameDateDay = (date1: Date, date2: Date): boolean => {
    return isSameDay(date1, date2);
};

// date range validator
export const isDateInRange = (date: Date, range: DateRange): boolean => {
    return (
        differenceInCalendarDays(date, range.start) >= 0 &&
        differenceInCalendarDays(date, range.end) <= 0
    );
};

// Date formatting with locale support
export const formatDisplayDate = (
    date: Date,
    formatStr: string = "MMMM dd, yyyy",
): string => {
    if (!date) return "";
    return format(date, formatStr);
};

// range formatting
export const formatDateRange = (range: DateRange | null): string => {
    if (!range) return "";
    const start = formatDisplayDate(range.start);
    const end = formatDisplayDate(range.end);

    return `${start} - ${end}`;
};

// year range helper
export const getYearRange = (
    centerYear: number = new Date().getFullYear(),
    offset: number = 50,
): number[] => {
    return Array.from(
        { length: offset * 2 + 1 },
        (_, i) => centerYear - offset + i,
    );
};

// get months array
export const getMonths = (): string[] => {
    return Array.from({ length: 12 }, (_, i) =>
        format(new Date(2024, i, 1), "MMMM"),
    );
};

// get hours array
export const getHours = (format: TimeFormat): string[] => {
    const max = format === "12h" ? 12 : 24;

    return Array.from({ length: max }, (_, i) => {
        const hour = format === "12h" && i === 0 ? 12 : i;
        return String(hour).padStart(2, "0");
    });
};

// get minutes array
export const getMinutes = (step: number = 5): string[] => {
    return Array.from({ length: 60 / step }, (_, i) =>
        String(i * step).padStart(2, "0"),
    );
};

// validation helpers
export const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !Number.isNaN(date.getTime());
};

// After - More robust:
export const isDateInbounds = (
    date: Date,
    minDate?: Date,
    maxDate?: Date,
): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
};

// sort date range
export const sortDateRange = (date1: Date, date2: Date): DateRange => {
    return date1 < date2
        ? { start: date1, end: date2 }
        : { start: date2, end: date1 };
};

// update calendar with selection
export const updateCalendarDays = (
    days: CalendarDay[],
    selectedDate: Date | null,
    selectedRange: DateRange | null,
): CalendarDay[] => {
    return days.map((day) => ({
        ...day,
        isSelected: selectedDate ? isSameDay(day.date, selectedDate) : false,
        isRangeStart: selectedRange
            ? isSameDay(day.date, selectedRange.start)
            : false,
        isRangeEnd: selectedRange
            ? isSameDay(day.date, selectedRange.end)
            : false,
        isInRange: selectedRange
            ? isDateInRange(day.date, selectedRange)
            : false,
    }));
};

// month navigation
export const getNextMonth = (currentMonth: Date): Date => {
    return addMonths(currentMonth, 1);
};

export const getPrevMonth = (currentMonth: Date): Date => {
    return subMonths(currentMonth, 1);
};

export const formatDateInputDisplay = (
    date: Date | DateRange | null,
    enableTime: boolean,
    timeFormat: TimeFormat = "12h",
    displayFormat: string,
): string => {
    if (!date) return "";

    if ("start" in date) {
        const startStr = format(date.start, displayFormat);
        const endStr = format(date.end, displayFormat);

        return `${startStr} - ${endStr}`;
    } else {
        if (enableTime) {
            const timeStr =
                timeFormat === "12h"
                    ? format(date, `${displayFormat} hh:mm a`)
                    : format(date, `${displayFormat} HH:mm`);
            return timeStr;
        }
        return format(date, displayFormat || "PPP");
    }
};

export const parseDateInput = (input: string): Date | null => {
    const parsed = new Date(input);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const convertTo24HourFormat = (
    hour12: number,
    isPM: boolean,
): number => {
    if (hour12 === 12) {
        return isPM ? 12 : 0;
    }
    return isPM ? hour12 + 12 : hour12;
};
