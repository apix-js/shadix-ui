"use client";
import { memo, useEffect, useRef } from "react";

import { motion } from "motion/react";
import type { CalendarDay } from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";

interface CalendarGridProps {
    currentMonth: Date;
    weeks: CalendarDay[][];
    direction: "next" | "prev";
    onDateClick: (date: CalendarDay) => void;
}

const MotionButton = motion.create(Button);

export const CalendarGrid = memo(
    ({ currentMonth, weeks, direction, onDateClick }: CalendarGridProps) => {
        const isFirstRender = useRef(true);

        useEffect(() => {
            isFirstRender.current = false;
        }, []);

        return (
            <motion.div
                key={currentMonth.toISOString()}
                initial={
                    isFirstRender.current
                        ? false
                        : {
                              opacity: 0,
                              x: direction === "next" ? 100 : -100,
                          }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={{
                    opacity: 0,
                    x: direction === "next" ? -100 : 100,
                }}
                transition={{
                    duration: 0.2,
                }}
            >
                <div className="space-y-1">
                    {weeks.map((week, weekIndex) => (
                        <div
                            key={`week_${String(weekIndex)}`}
                            className="grid grid-cols-7 gap-0"
                        >
                            {week.map((day) => (
                                <MotionButton
                                    key={`day_${day.date.getTime()}`}
                                    onClick={() => onDateClick(day)}
                                    size={"sm"}
                                    variant={
                                        day.isSelected ||
                                        day.isRangeStart ||
                                        day.isRangeEnd
                                            ? "default"
                                            : "ghost"
                                    }
                                    disabled={
                                        day.isDisabled || !day.isCurrentMonth
                                    }
                                    whileHover={
                                        !day.isDisabled && !day.isSelected
                                            ? {
                                                  scale: 1.05,
                                              }
                                            : {}
                                    }
                                    whileTap={
                                        !day.isDisabled
                                            ? {
                                                  scale: 0.95,
                                              }
                                            : {}
                                    }
                                    className={cn(
                                        "transition-all",
                                        !day.isCurrentMonth &&
                                            "text-gray-400 dark:text-stone-700",
                                        day.isDisabled &&
                                            "opacity-50 cursor-not-allowed",
                                        day.isRangeStart &&
                                            "bg-blue-600 dark:bg-blue-400 text-white rounded-r-none",
                                        day.isRangeEnd &&
                                            "bg-blue-600 dark:bg-blue-400 text-white rounded-l-none",
                                        day.isInRange &&
                                            !day.isRangeStart &&
                                            !day.isRangeEnd &&
                                            "bg-blue-100 dark:bg-blue-900 rounded-none",
                                    )}
                                >
                                    {day.date.getDate()}
                                </MotionButton>
                            ))}
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    },
);
