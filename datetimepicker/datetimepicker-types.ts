export type DatePickerMode = "single" | "range";
export type TimeFormat = "12h" | "24h";
export type DateTimePickerView = "date" | "time";

export interface DateTimePickerProps {
    value?: Date | DateRange | null;
    mode: DatePickerMode;
    enableTime?: boolean;
    timeFormat?: TimeFormat;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    placeholder?: string;
    disableInitialAnimation?: boolean;
    onDateChange: (date: Date | DateRange | null) => void;
    onClose?: () => void;
    disabled?: (date: Date) => boolean;
}

export interface DateRange {
    start: Date;
    end: Date;
}

export interface DateTimePickerState {
    selectedDate: Date | null;
    selectedRange: DateRange | null;
    selectedTime: { hours: number; minutes: number } | null;
    currentMonth: Date;
    view: DateTimePickerView;
    isRangeEnd: boolean;
    isOpen: boolean;
}

export interface TimePickerConfig {
    format: TimeFormat;
    step: number;
    startHour?: number;
    maxHour?: number;
}

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
    isDisabled: boolean;
}
