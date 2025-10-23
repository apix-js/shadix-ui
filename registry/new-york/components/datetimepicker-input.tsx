import { memo, useCallback, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, XIcon } from "lucide-react";
import type {
    DateRange,
    DateTimePickerProps,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

import { DateTimePicker } from "@/registry/new-york/components/datetimepicker";
import { formatDateInputDisplay } from "@/registry/new-york/components/datetimepicker/datetimepicker-utils";
import { useClickOutside } from "@/registry/new-york/hooks/useClickOutside";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from "@/shadcn/components/ui/input-group";
import { cn } from "@/shadcn/lib/utils";
export interface DateTimeInputProps extends Partial<DateTimePickerProps> {
    value?: Date | DateRange | null;
    onValueChange?: (value: Date | DateRange | null) => void;
    displayFormat?: string;
    placeholder?: string;
    clearable?: boolean;
    name?: string;
    id?: string;
    onClear?: () => void;
}

export const DateTimeInput = memo(
    ({
        mode,
        enableTime = false,
        timeFormat = "12h",
        value,
        onValueChange,
        placeholder = "Select Date",
        clearable = true,
        onClear,
        className,
        displayFormat = "MM/dd/yyyy",
        ...props
    }: DateTimeInputProps) => {
        const [isOpen, setIsOpen] = useState(false);

        const pickerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLDivElement>(null);

        useClickOutside({
            ref: [pickerRef, inputRef],
            callback: (e) => {
                const target = e.target as HTMLElement;

                // Only prevent closing if clicking on THIS input's control buttons
                if (
                    target.dataset?.slot === "input-group-control" &&
                    inputRef.current?.contains(target)
                ) {
                    return;
                }

                // Close picker when clicking outside
                setIsOpen(false);
            },
        });

        const displayValue = formatDateInputDisplay(
            value ?? null,
            enableTime,
            timeFormat,
            displayFormat,
        );

        const handleDateChange = useCallback(
            (newValue: Date | DateRange | null) => {
                onValueChange?.(newValue);
            },
            [onValueChange],
        );

        const handleClear = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                onValueChange?.(null);
                onClear?.();
            },
            [onValueChange, onClear],
        );

        return (
            <div
                ref={inputRef}
                data-slot="datetimepicker-input"
                className="relative w-full"
            >
                <div className="relative flex items-center">
                    <InputGroup className="w-full">
                        <InputGroupInput
                            placeholder={placeholder}
                            value={displayValue}
                            readOnly
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen((prev) => !prev);
                            }}
                        />
                        <InputGroupAddon align="inline-end">
                            {/* {clearable && displayValue && ( */}
                            <InputGroupButton
                                variant={"ghost"}
                                size={"icon-xs"}
                                onClick={handleClear}
                                className={cn(
                                    "rounded-full",
                                    clearable && displayValue
                                        ? "visible"
                                        : "invisible",
                                )}
                            >
                                <XIcon />
                            </InputGroupButton>
                            {/* )} */}
                            <InputGroupText>
                                <Calendar />
                            </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <AnimatePresence mode="sync">
                    {isOpen && (
                        <motion.div
                            ref={pickerRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className="absolute z-50 mt-2 top-full bg-background rounded-lg shadow-lg left-0 w-full"
                        >
                            <DateTimePicker
                                mode={mode ?? "single"}
                                enableTime={enableTime}
                                timeFormat={timeFormat}
                                onDateChange={handleDateChange}
                                onClose={() => setIsOpen(false)}
                                disableInitialAnimation={true}
                                value={value}
                                {...props}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    },
);
