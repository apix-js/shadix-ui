"use client";
import { memo, useCallback, useEffect } from "react";

import { AnimatePresence } from "motion/react";
import type {
    DateRange,
    DateTimePickerProps,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

import { DatePickerView } from "@/registry/new-york/components/datetimepicker/datepicker-view";
import {
    DateTimePickerProvider,
    useDateTimePicker,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-context";
import { sortDateRange } from "@/registry/new-york/components/datetimepicker/datetimepicker-utils";
import { TimePickerView } from "@/registry/new-york/components/datetimepicker/timepicker-view";
import { cn } from "@/shadcn/lib/utils";

const DateTimePickerInner = memo(
    ({
        mode,
        enableTime = false,
        timeFormat = "12h",
        onDateChange,
        onClose,
        minDate,
        maxDate,
        disabled,
        disableInitialAnimation = false,
        className,
        value,
    }: DateTimePickerProps) => {
        const { state, dispatch, selectDate, selectTime } = useDateTimePicker();

        const handleDateSelect = useCallback(
            (date: Date) => {
                if (mode === "single") {
                    selectDate(date);
                    if (!enableTime) {
                        onDateChange(date);
                        onClose?.();
                    } else {
                        dispatch({ type: "SET_VIEW", payload: "time" });
                        selectTime(12, 0);
                    }
                } else if (mode === "range") {
                    if (!state.selectedDate) {
                        // First click - select start date
                        selectDate(date);
                        dispatch({ type: "SET_RANGE_END", payload: true });
                    } else {
                        // Second click - complete the range
                        const range = sortDateRange(state.selectedDate, date);
                        dispatch({ type: "SET_RANGE", payload: range });

                        if (!enableTime) {
                            onDateChange(range);
                            onClose?.();
                        } else {
                            dispatch({ type: "SET_VIEW", payload: "time" });
                            selectTime(12, 0);
                        }
                    }
                }
            },
            [
                mode,
                state.selectedDate,
                enableTime,
                selectDate,
                selectTime,
                dispatch,
                onDateChange,
                onClose,
            ],
        );

        const handleTimeConfirm = useCallback(() => {
            if (state.selectedTime) {
                const finalDate = new Date(state.selectedDate || new Date());
                finalDate.setHours(
                    state.selectedTime.hours,
                    state.selectedTime.minutes,
                    0,
                );

                if (mode === "single") {
                    onDateChange?.(finalDate);
                } else if (mode === "range" && state.selectedRange) {
                    const startDate = new Date(state.selectedRange.start);
                    const endDate = new Date(state.selectedRange.end);

                    startDate.setHours(
                        state.selectedTime.hours,
                        state.selectedTime.minutes,
                        0,
                    );
                    endDate.setHours(
                        state.selectedTime.hours,
                        state.selectedTime.minutes,
                        0,
                    );

                    onDateChange?.({
                        start: startDate,
                        end: endDate,
                    });
                }

                dispatch({ type: "SET_VIEW", payload: "date" });

                onClose?.();
            }
        }, [
            state.selectedDate,
            state.selectedRange,
            state.selectedTime,
            mode,
            onDateChange,
            onClose,
            dispatch,
        ]);

        useEffect(() => {
            if (!value || value === null) {
                dispatch({ type: "RESET" });
                return;
            }

            if (mode === "single" && value instanceof Date) {
                dispatch({ type: "SET_DATE", payload: value });
                dispatch({ type: "SET_DISPLAY_MONTH", payload: value });
            } else if (
                mode === "range" &&
                value &&
                typeof value === "object" &&
                "start" in value &&
                "end" in value
            ) {
                dispatch({ type: "SET_RANGE", payload: value as DateRange });
                dispatch({
                    type: "SET_DISPLAY_MONTH",
                    payload: (value as DateRange).start,
                });
            }
        }, [value, dispatch, mode]);

        return (
            <div
                className={cn(
                    "flex items-center justify-center w-[250px] max-w-md mx-auto overflow-hidden border rounded-lg",
                    className,
                )}
            >
                <AnimatePresence mode="wait">
                    {state.view === "date" ? (
                        <DatePickerView
                            key={`date-picker`}
                            selectedDate={state.selectedDate}
                            selectedRange={state.selectedRange}
                            currentMonth={state.currentMonth}
                            mode={mode}
                            onDateSelect={handleDateSelect}
                            onMonthChange={(month) =>
                                dispatch({
                                    type: "SET_DISPLAY_MONTH",
                                    payload: month,
                                })
                            }
                            minDate={minDate}
                            maxDate={maxDate}
                            disabled={disabled}
                            disableInitialAnimation={disableInitialAnimation}
                        />
                    ) : (
                        <TimePickerView
                            key="time-picker"
                            hours={state.selectedTime?.hours ?? 12}
                            minutes={state.selectedTime?.minutes ?? 0}
                            format={timeFormat}
                            onHoursChange={(hours) =>
                                selectTime(
                                    hours,
                                    state.selectedTime?.minutes ?? 0,
                                )
                            }
                            onMinutesChange={(minutes) =>
                                selectTime(
                                    state.selectedTime?.hours ?? 12,
                                    minutes,
                                )
                            }
                            onConfirm={handleTimeConfirm}
                            onCancel={() =>
                                dispatch({ type: "SET_VIEW", payload: "date" })
                            }
                        />
                    )}
                </AnimatePresence>
            </div>
        );
    },
);

DateTimePickerInner.displayName = "DateTimePickerInner";

// Exported component with provider
export const DateTimePicker = memo((props: DateTimePickerProps) => {
    return (
        <DateTimePickerProvider mode={props.mode} enableTime={props.enableTime}>
            <DateTimePickerInner {...props} />
        </DateTimePickerProvider>
    );
});

DateTimePicker.displayName = "DateTimePicker";
