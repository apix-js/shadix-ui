"use client";
import { useState } from "react";
import type React from "react";

import { format } from "date-fns";

import { DateTimeInput } from "@/registry/new-york/components/datetimepicker-input";

const DateTimePickerDemo: React.FC<DateTimePickerDemoProps> = () => {
    const [singleDate, setSingleDate] = useState<Date>(new Date());

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <DateTimeInput
                mode="single"
                enableTime={true}
                timeFormat="24h"
                value={singleDate}
                onValueChange={(date) => {
                    setSingleDate(date as Date);
                }}
                placeholder="Select date and time"
            />

            <h3>Selected Date: {format(singleDate, "yyyy-MM-dd HH:mm")}</h3>
        </div>
    );
};

interface DateTimePickerDemoProps {
    [key: string]: unknown;
}

export default DateTimePickerDemo;
