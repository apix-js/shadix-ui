import { memo } from "react";

import { motion } from "framer-motion";
import type { TimeFormat } from "@/datetimepicker/datetimepicker-types";

import { WheelTimePicker } from "@/datetimepicker/wheel-time-picker";
import { Button } from "@/shadcn/components/ui/button";

interface TimePickerViewProps {
    hours: number;
    minutes: number;
    format: TimeFormat;
    onHoursChange: (hours: number) => void;
    onMinutesChange: (minutes: number) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export const TimePickerView = memo(
    ({
        hours,
        minutes,
        format,
        onHoursChange,
        onMinutesChange,
        onConfirm,
        onCancel,
    }: TimePickerViewProps) => {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full mx-auto p-3 bg-background rounded-lg"
            >
                <h2 className="text-lg font-semibold text-primary mb-6 text-center">
                    Select Time
                </h2>

                {/* wheel time picker */}
                <div className="mb-6">
                    <WheelTimePicker
                        hours={hours}
                        minutes={minutes}
                        format={format}
                        onHoursChange={onHoursChange}
                        onMinutesChange={onMinutesChange}
                        minuteStep={5}
                    />
                </div>

                {/* action buttons */}
                <div className="flex gap-3 justify-between">
                    <Button onClick={onCancel} variant={"outline"} size={"sm"}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant={"outline"} size={"sm"}>
                        Confirm
                    </Button>
                </div>
            </motion.div>
        );
    },
);

TimePickerView.displayName = "TimePickerView";
