import { memo } from "react";

import { getMonths } from "@/datetimepicker/datetimepicker-utils";
import {
    WheelPicker,
    type WheelPickerOption,
} from "@/shadcn/components/wheel-picker";

interface WheelMonthPickerProps {
    value: number;
    disabled?: boolean;
    onChange: (month: number) => void;
}

export const WheelMonthPicker = memo(
    ({ value, onChange }: WheelMonthPickerProps) => {
        const months = getMonths();

        const options: WheelPickerOption[] = months.map((month, i) => ({
            value: String(i),
            label: String(month),
        }));

        return (
            <WheelPicker
                data-id="month-picker"
                options={options}
                value={String(value)}
                onValueChange={(val) => onChange(Number(val))}
                classNames={{
                    optionItem: "text-center px-4",
                }}
            />
        );
    },
);

WheelMonthPicker.displayName = "WheelMonthPicker";
