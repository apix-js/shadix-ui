"use client";
import { createContext, type ReactNode, useContext, useReducer } from "react";

import { addMonths, subMonths } from "date-fns";
import type {
    DatePickerMode,
    DateTimePickerState,
} from "@/registry/new-york/components/datetimepicker/datetimepicker-types";

export interface DateTimePickerContextType {
    state: DateTimePickerState;
    dispatch: (action: DateTimePickerAction) => void;
    enableTime: boolean;
    selectDate: (date: Date) => void;
    selectTime: (hours: number, minutes: number) => void;
    selectMonth: (month: number) => void;
    selectYear: (year: number) => void;
    nextMonth: () => void;
    prevMonth: () => void;
    closePicker: () => void;
    resetSelection: () => void;
}

export type DateTimePickerAction =
    | { type: "SET_DATE"; payload: Date | null }
    | { type: "SET_RANGE"; payload: { start: Date; end: Date } | null }
    | { type: "SET_TIME"; payload: { hours: number; minutes: number } }
    | { type: "SET_VIEW"; payload: "date" | "time" }
    | { type: "SET_DISPLAY_MONTH"; payload: Date }
    | { type: "NEXT_MONTH" }
    | { type: "PREVIOUS_MONTH" }
    | { type: "TOGGLE_OPEN" }
    | { type: "RESET" }
    | { type: "SET_RANGE_END"; payload: boolean };

export const init = (_mode: DatePickerMode = "single"): DateTimePickerState => {
    return {
        selectedDate: null,
        selectedRange: null,
        selectedTime: null,
        currentMonth: new Date(),
        view: "date",
        isRangeEnd: false,
        isOpen: false,
    };
};

export const reducer = (
    state: DateTimePickerState,
    action: DateTimePickerAction,
): DateTimePickerState => {
    switch (action.type) {
        case "SET_DATE":
            return { ...state, selectedDate: action.payload };
        case "SET_RANGE":
            return { ...state, selectedRange: action.payload };
        case "SET_TIME":
            return { ...state, selectedTime: action.payload };
        case "SET_VIEW":
            return { ...state, view: action.payload };
        case "SET_DISPLAY_MONTH":
            return { ...state, currentMonth: action.payload };
        case "NEXT_MONTH":
            return { ...state, currentMonth: addMonths(state.currentMonth, 1) };
        case "PREVIOUS_MONTH":
            return { ...state, currentMonth: subMonths(state.currentMonth, 1) };
        case "TOGGLE_OPEN":
            return { ...state, isOpen: !state.isOpen };
        case "RESET":
            return init();
        case "SET_RANGE_END":
            return { ...state, isRangeEnd: action.payload };
        default:
            return state;
    }
};

const DateTimePickerContext = createContext<
    DateTimePickerContextType | undefined
>(undefined);

export interface DateTimePickerProviderProps {
    children: ReactNode;
    mode: DatePickerMode;
    enableTime?: boolean;
}

export const DateTimePickerProvider: React.FC<DateTimePickerProviderProps> = ({
    children,
    mode,
    enableTime = false,
}) => {
    const [state, dispatch] = useReducer(reducer, init(mode));

    // feat: helper to safely update month while preserving year
    const updateMonth = (month: number): Date => {
        const date = new Date(state.currentMonth);
        date.setMonth(month);
        return date;
    };

    // feat: helper to safely update year while preserving month
    const updateYear = (year: number): Date => {
        const date = new Date(state.currentMonth);
        date.setFullYear(year);
        return date;
    };

    const value: DateTimePickerContextType = {
        state,
        dispatch,
        enableTime,
        selectDate: (date) => dispatch({ type: "SET_DATE", payload: date }),
        selectTime: (hours, minutes) =>
            dispatch({ type: "SET_TIME", payload: { hours, minutes } }),
        selectMonth: (month) =>
            dispatch({
                type: "SET_DISPLAY_MONTH",
                payload: updateMonth(month),
            }),
        selectYear: (year) =>
            dispatch({ type: "SET_DISPLAY_MONTH", payload: updateYear(year) }),
        nextMonth: () => dispatch({ type: "NEXT_MONTH" }),
        prevMonth: () => dispatch({ type: "PREVIOUS_MONTH" }),
        closePicker: () => dispatch({ type: "TOGGLE_OPEN" }),
        resetSelection: () => dispatch({ type: "RESET" }),
    };

    return (
        <DateTimePickerContext.Provider value={value}>
            {children}
        </DateTimePickerContext.Provider>
    );
};

// feat: custom hook to use datetime picker context
export const useDateTimePicker = (): DateTimePickerContextType => {
    const context = useContext(DateTimePickerContext);
    if (!context) {
        throw new Error(
            "useDateTimePicker must be used within DateTimePickerProvider",
        );
    }
    return context;
};
