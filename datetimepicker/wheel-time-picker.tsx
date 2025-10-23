import { memo, useMemo } from "react";

import type { TimeFormat } from "@/datetimepicker/datetimepicker-types";

import { convertTo24HourFormat } from "@/datetimepicker/datetimepicker-utils";
import {
    WheelPicker,
    type WheelPickerOption,
    WheelPickerWrapper,
} from "@/shadcn/components/wheel-picker";

interface WheelTimePickerProps {
    hours: number;
    minutes: number;
    format: TimeFormat;
    disabled?: boolean;
    minuteStep?: number;
    onHoursChange: (hours: number) => void;
    onMinutesChange: (minutes: number) => void;
}

export const WheelTimePicker = memo(
    ({
        hours,
        minutes,
        format,
        minuteStep = 5,
        onHoursChange,
        onMinutesChange,
    }: WheelTimePickerProps) => {
        // Determine period (AM/PM) based on hours in 24h format
        const period = hours >= 12 ? "PM" : "AM";

        // Convert 24h to 12h for display (only apply modulo in 12h mode)
        const displayHours =
            format === "12h"
                ? hours === 0
                    ? 12
                    : hours > 12
                      ? hours - 12
                      : hours
                : hours;

        const hourOptions: WheelPickerOption[] = useMemo(() => {
            if (format === "12h") {
                // For 12h format: 12, 1, 2, ..., 11
                return [
                    { value: "12", label: "12" },
                    ...Array.from({ length: 11 }, (_, i) => {
                        const hour = i + 1;
                        return {
                            value: String(hour).padStart(2, "0"),
                            label: String(hour).padStart(2, "0"),
                        };
                    }),
                ];
            } else {
                // For 24h format: 0-23
                return Array.from({ length: 24 }, (_, i) => ({
                    value: String(i).padStart(2, "0"),
                    label: String(i).padStart(2, "0"),
                }));
            }
        }, [format]);

        const minuteOptions: WheelPickerOption[] = useMemo(() => {
            return Array.from({ length: 60 / minuteStep }, (_, i) => ({
                value: String(i * minuteStep).padStart(2, "0"),
                label: String(i * minuteStep).padStart(2, "0"),
            }));
        }, [minuteStep]);

        const handleHourChange = (val: string) => {
            if (format === "12h") {
                // Convert 12h to 24h
                const hour12 = Number(val);
                const hour24 = convertTo24HourFormat(hour12, period === "PM");
                onHoursChange(hour24);
            } else {
                onHoursChange(Number(val));
            }
        };

        const handlePeriodChange = (val: string) => {
            // Only apply period conversion in 12h mode
            if (format !== "12h") return;

            // Convert current display hour back to 24h with new period
            const isPM = val === "PM";
            const hour24 =
                displayHours === 12
                    ? isPM
                        ? 12
                        : 0
                    : isPM
                      ? displayHours + 12
                      : displayHours;
            onHoursChange(hour24);
        };

        return (
            <div className="flex flex-col items-center gap-4">
                <WheelPickerWrapper className="border-none">
                    <WheelPicker
                        options={hourOptions}
                        value={String(
                            format === "12h" ? displayHours : hours,
                        ).padStart(2, "0")}
                        onValueChange={handleHourChange}
                        classNames={{
                            optionItem: "text-center",
                        }}
                        infinite
                    />

                    <WheelPicker
                        options={minuteOptions}
                        value={String(minutes).padStart(2, "0")}
                        onValueChange={(val) => onMinutesChange(Number(val))}
                        classNames={{
                            optionItem: "text-center",
                        }}
                        infinite
                    />

                    {format === "12h" && (
                        <WheelPicker
                            options={[
                                {
                                    value: "AM",
                                    label: "AM",
                                },
                                {
                                    value: "PM",
                                    label: "PM",
                                },
                            ]}
                            value={period}
                            onValueChange={handlePeriodChange}
                            classNames={{
                                optionItem: "text-center",
                            }}
                        />
                    )}
                </WheelPickerWrapper>
            </div>
        );
    },
);

WheelTimePicker.displayName = "WheelTimePicker";
