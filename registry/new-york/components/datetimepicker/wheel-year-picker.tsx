import { memo, useMemo } from "react";

import {
    WheelPicker,
    type WheelPickerOption,
} from "@/shadcn/components/wheel-picker";

interface WheelYearPickerProps {
    value: number;
    minYear?: number;
    maxYear?: number;
    disabled?: boolean;
    onChange: (year: number) => void;
}

export const WheelYearPicker = memo(
    ({ value, maxYear, minYear, onChange }: WheelYearPickerProps) => {
        const options: WheelPickerOption[] = useMemo(() => {
            const currentYear = new Date().getFullYear();
            const min = minYear ?? currentYear - 50;
            const max = maxYear ?? currentYear + 50;

            return Array.from({ length: max - min + 1 }, (_, i) => ({
                value: String(min + i),
                label: String(min + i),
            }));
        }, [minYear, maxYear]);

        return (
            <WheelPicker
                data-id="year-picker"
                options={options}
                value={String(value)}
                onValueChange={(val) => onChange(Number(val))}
                classNames={{
                    optionItem: "text-center px-4",
                    // highlightWrapper: "bg-blue-50 dark:bg-blue-950 rounded-lg",
                }}
            />
        );
    },
);

WheelYearPicker.displayName = "WheelYearPicker";
