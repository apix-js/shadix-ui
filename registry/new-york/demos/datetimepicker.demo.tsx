import { useEffect, useRef, useState } from "react";
import type React from "react";

import { addDays } from "date-fns";
import type { DateRange } from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

import { DateTimeInput } from "@/registry/new-york/components/datetimepicker-input";

const DateTimePickerDemo: React.FC<DateTimePickerDemoProps> = () => {
    // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [singleDate, setSingleDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    const hasInitialized = useRef(false);

    // feat: initialize dates only once after hydration
    useEffect(() => {
        if (hasInitialized.current) return;

        setSingleDate(new Date());
        // setSelectedDate(new Date());
        setDateRange({ start: new Date(), end: addDays(new Date(), 5) });

        hasInitialized.current = true;
    }, []); // ✅ Empty dependency array - runs only once

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Single Date Input</h2>
                <DateTimeInput
                    mode="single"
                    // enableTime={true}
                    // timeFormat="24h"
                    value={singleDate}
                    onValueChange={(date) => {
                        setSingleDate(date instanceof Date ? date : null);
                    }}
                    placeholder="Select date and time"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Date Range Input</h2>
                <DateTimeInput
                    mode="range"
                    enableTime={false}
                    value={dateRange}
                    onValueChange={(range) => setDateRange(range as DateRange)}
                    placeholder="Select date range"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Standalone Date Picker
                </h2>
            </div>
        </div>
    );
};

interface DateTimePickerDemoProps {
    [key: string]: unknown;
}

export default DateTimePickerDemo;
