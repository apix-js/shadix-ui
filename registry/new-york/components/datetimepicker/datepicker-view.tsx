"use client";
import { memo, useMemo, useState } from "react";

import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type {
    CalendarDay,
    DatePickerMode,
    DateRange,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

import { CalendarGrid } from "@/registry/new-york/components/datetimepicker/calendar-grid";
import {
    generateCalendarDays,
    getNextMonth,
    getPrevMonth,
    updateCalendarDays,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-utils";
import { WheelMonthPicker } from "@/registry/new-york/components/datetimepicker/wheel-month-picker";
import { WheelYearPicker } from "@/registry/new-york/components/datetimepicker/wheel-year-picker";
import { Button } from "@/shadcn/components/ui/button";
import { WheelPickerWrapper } from "@/shadcn/components/wheel-picker";

interface DatePickerViewProps {
    selectedDate: Date | null;
    selectedRange: DateRange | null;
    currentMonth: Date;
    mode: DatePickerMode;
    minDate?: Date;
    maxDate?: Date;
    disabled?: (date: Date) => boolean;
    disableInitialAnimation?: boolean;
    onDateSelect: (date: Date) => void;
    onMonthChange: (month: Date) => void;
}

export const DatePickerView = memo(
    ({
        selectedDate,
        selectedRange,
        currentMonth,
        minDate,
        maxDate,
        disabled,
        disableInitialAnimation = false,
        onDateSelect,
        onMonthChange,
    }: DatePickerViewProps) => {
        const [direction, setDirection] = useState<"next" | "prev">("next");
        const [showMonthPicker, setShowMonthPicker] = useState(false);

        const calendarDays = useMemo(() => {
            const days = generateCalendarDays(currentMonth);
            return updateCalendarDays(days, selectedDate, selectedRange).map(
                (day) => ({
                    ...day,
                    isDisabled: !!(
                        disabled?.(day.date) ??
                        ((minDate && day.date < minDate) ||
                            (maxDate && day.date > maxDate))
                    ),
                }),
            );
        }, [
            currentMonth,
            selectedDate,
            selectedRange,
            minDate,
            maxDate,
            disabled,
        ]);

        const handlePrev = () => {
            setDirection("prev");
            onMonthChange(getPrevMonth(currentMonth));
        };

        const handleNext = () => {
            setDirection("next");
            onMonthChange(getNextMonth(currentMonth));
        };

        const handleDateClick = (day: CalendarDay) => {
            if (day.isDisabled) return;

            onDateSelect(day.date);
        };

        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeks = useMemo(() => {
            const _weeks = [];
            for (let i = 0; i < 6; i++) {
                const week = calendarDays.slice(i * 7, (i + 1) * 7);
                _weeks.push(week);
            }
            return _weeks;
        }, [calendarDays]);

        return (
            <motion.div
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col transition-all duration-200 justify-between gap-4 w-full max-w-md mx-auto p-3 bg-background"
            >
                {/* picker header */}
                <div className="">
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            onClick={handlePrev}
                            size={"sm"}
                            aria-label="Previous month"
                            variant="ghost"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Button>

                        <Button
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => setShowMonthPicker((prev) => !prev)}
                            aria-label="Select month"
                            className="relative flex-1 overflow-hidden"
                        >
                            <AnimatePresence mode="sync">
                                <motion.span
                                    key={format(currentMonth, "MMMM yyyy")}
                                    initial={{
                                        opacity: 0,
                                        x: direction === "next" ? 30 : -30,
                                        rotateX: 90,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0, // Move to center
                                        rotateX: 0, // Straighten up
                                        scale: 1, // Full size
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: direction === "next" ? -30 : 30, // Exit upward
                                        rotateX: -90, // Rotate out
                                        scale: 0.8, // Shrink slightly
                                    }}
                                    transition={{
                                        duration: 0.3, // Slightly longer for smooth wheel effect
                                        ease: "easeInOut",
                                        // type: "spring", // Spring animation for natural feel
                                        stiffness: 100,
                                        damping: 15,
                                    }}
                                    style={{
                                        transformStyle: "preserve-3d", // Enable 3D transforms
                                        perspective: 1000, // Add perspective for depth
                                    }}
                                    className="absolute inset-0 top-0 bottom-0 m-auto h-full flex items-center justify-center"
                                >
                                    {format(currentMonth, "MMMM yyyy")}
                                </motion.span>
                            </AnimatePresence>
                        </Button>

                        <Button
                            onClick={handleNext}
                            size={"sm"}
                            aria-label="Next month"
                            variant="ghost"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden h-fit flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {showMonthPicker && (
                            <motion.div
                                key="month-picker"
                                initial={
                                    disableInitialAnimation
                                        ? false
                                        : { opacity: 0, scale: 1.5 }
                                }
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                                className="w-full"
                            >
                                {/* month/year wheel pickers */}
                                <WheelPickerWrapper className="w-full bg-transparent border-none">
                                    <WheelMonthPicker
                                        value={currentMonth.getMonth()}
                                        onChange={(month) => {
                                            const newDate = new Date(
                                                currentMonth,
                                            );
                                            newDate.setMonth(month);
                                            onMonthChange(newDate);
                                        }}
                                    />
                                    <WheelYearPicker
                                        value={currentMonth.getFullYear()}
                                        onChange={(year: number) => {
                                            const newDate = new Date(
                                                currentMonth,
                                            );
                                            newDate.setFullYear(year);
                                            onMonthChange(newDate);
                                        }}
                                        minYear={minDate?.getFullYear()}
                                        maxYear={maxDate?.getFullYear()}
                                    />
                                </WheelPickerWrapper>
                            </motion.div>
                        )}

                        {!showMonthPicker && (
                            <motion.div
                                key="calendar-view"
                                initial={
                                    disableInitialAnimation
                                        ? false
                                        : { opacity: 0, scale: 1.5 }
                                }
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                            >
                                <div>
                                    {/* week days header */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {weekDays.map((day) => (
                                            <div
                                                key={`${day}_header`}
                                                className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <CalendarGrid
                                        currentMonth={currentMonth}
                                        weeks={weeks}
                                        direction={direction}
                                        onDateClick={handleDateClick}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    },
);

DatePickerView.displayName = "DatePickerView";
