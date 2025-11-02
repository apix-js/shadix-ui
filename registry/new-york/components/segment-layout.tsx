"use client";

import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import { AnimatePresence, motion } from "motion/react";
import type { ClassValue } from "clsx";

import { cn } from "@/shadcn/lib/utils";

interface SegmentLayoutContextValue {
    active: string;
    isActive: (value?: string) => boolean;
    setActive: React.Dispatch<React.SetStateAction<string>>;
}

const SegmentLayoutContext = createContext<SegmentLayoutContextValue>({
    active: "",
    isActive: () => false,
    setActive: () => {},
});

const useSegmentLayout = () => {
    const context = useContext(SegmentLayoutContext);
    if (!context) {
        throw new Error(
            "useSegmentLayout must be used within a SegmentLayoutProvider",
        );
    }
    return context;
};

type ItemType = {
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
};

type ClassNamesType = {
    mainWrapper?: ClassValue;
    itemsWrapper?: ClassValue;
    leftWrapper?: ClassValue;
    rightWrapper?: ClassValue;
    contentWrapper?: ClassValue;
    item?: ClassValue;
    disabledItem?: ClassValue;
    leftItem?: ClassValue;
    rightItem?: ClassValue;
    activeItem?: ClassValue;
    activeLeftItem?: ClassValue;
    activeRightItem?: ClassValue;
    disabledLeftItem?: ClassValue;
    disabledRightItem?: ClassValue;
};

interface SegmentLayoutProps {
    /** @public (required) - The left side items of the segment layout */
    leftItems: ItemType[];
    /** @public (required) - The right side items of the segment layout */
    rightItems: ItemType[];
    /** @public (required) - The content of the segment layout */
    children: React.ReactNode;
    /** @public (optional) - The className of the segment layout */
    defaultValue?: string;
    /** @public (optional) - The className of the segment layout container */
    classNames?: ClassNamesType;
}

interface SegmentLayoutRef extends SegmentLayoutContextValue {}

const SegmentLayoutProvider = (
    props: Pick<SegmentLayoutProps, "defaultValue" | "children">,
) => {
    const [active, setActive] = useState(props.defaultValue ?? "");

    const isActive = useCallback(
        (value?: string) => {
            return value ? active === value : active !== "";
        },
        [active],
    );

    const contextValue = useMemo(
        () => ({ active, setActive, isActive }),
        [active, isActive],
    );

    return (
        <SegmentLayoutContext.Provider value={contextValue}>
            {props.children}
        </SegmentLayoutContext.Provider>
    );
};

const SegmentLayoutContentInner = forwardRef<
    SegmentLayoutRef,
    Pick<
        SegmentLayoutProps,
        "leftItems" | "rightItems" | "children" | "classNames" | "defaultValue"
    >
>(({ leftItems, rightItems, children, classNames, defaultValue }, ref) => {
    const [height, setHeight] = useState<number>(160);

    const { active, isActive, setActive } = useSegmentLayout();

    const contentRef = useRef<HTMLDivElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    useImperativeHandle(ref, () => ({
        active,
        isActive,
        setActive,
    }));

    useEffect(() => {
        if (defaultValue) return;

        const firstItem = leftItems[0] || rightItems[0];
        if (firstItem) {
            setActive(firstItem.value);
        }
    }, [defaultValue, leftItems, rightItems, setActive]);

    const contentRefCallback = useCallback((node: HTMLDivElement | null) => {
        if (resizeObserverRef.current) {
            resizeObserverRef.current.disconnect();
            resizeObserverRef.current = null;
        }

        if (!node) {
            contentRef.current = null;
            return;
        }

        contentRef.current = node;

        const initialHeight = node.scrollHeight;
        if (initialHeight > 0) {
            setHeight(initialHeight);
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;
                if (newHeight > 0) {
                    setHeight(newHeight);
                }
            }
        });

        resizeObserver.observe(node);
        resizeObserverRef.current = resizeObserver;
    }, []);

    useEffect(() => {
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
        };
    }, []);

    if (!active) return null;

    return (
        <div
            data-slot="segment-layout"
            data-active={active}
            className={cn(
                "flex w-full items-center justify-center gap-8 p-4 sm:p-6",
                classNames?.mainWrapper,
            )}
        >
            {/* Left Items */}
            <ItemWrapper
                position="left"
                items={leftItems}
                className={cn(
                    classNames?.itemsWrapper,
                    classNames?.leftWrapper,
                )}
                classNames={{
                    item: classNames?.item,
                    disabledItem: classNames?.disabledItem,
                    leftItem: classNames?.leftItem,
                    activeItem: classNames?.activeItem,
                    activeLeftItem: classNames?.activeLeftItem,
                    disabledLeftItem: classNames?.disabledLeftItem,
                }}
            />

            {/* Content Wrapper */}
            <AnimatePresence mode="wait">
                <motion.main
                    data-slot="segment-layout-content"
                    animate={{ height }}
                    className={cn(
                        "flex-1 max-w-2xl flex items-center bg-card justify-center w-full min-h-40 rounded-lg border shadow-lg overflow-hidden",
                        classNames?.contentWrapper,
                    )}
                    transition={{
                        height: {
                            duration: 0.2,
                            ease: "linear",
                        },
                    }}
                >
                    <div ref={contentRefCallback} className="w-full">
                        {React.Children.map(children, (child) => {
                            if (!React.isValidElement(child)) return null;

                            const childElement =
                                child as React.ReactElement<SegmentLayoutContentProps>;

                            if (childElement.props.value !== active)
                                return null;

                            return (
                                <motion.div
                                    key={childElement.props.value}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        opacity: {
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1],
                                        },
                                        y: {
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1],
                                        },
                                    }}
                                    style={{ width: "100%" }}
                                >
                                    {child}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.main>
            </AnimatePresence>

            {/* Right Items */}
            <ItemWrapper
                position="right"
                items={rightItems}
                className={cn(
                    classNames?.itemsWrapper,
                    classNames?.rightWrapper,
                )}
                classNames={{
                    item: classNames?.item,
                    disabledItem: classNames?.disabledItem,
                    rightItem: classNames?.rightItem,
                    activeItem: classNames?.activeItem,
                    activeRightItem: classNames?.activeRightItem,
                    disabledRightItem: classNames?.disabledRightItem,
                }}
            />
        </div>
    );
});

SegmentLayoutContentInner.displayName = "SegmentLayoutContentInner";

const SegmentLayout = forwardRef<SegmentLayoutRef, SegmentLayoutProps>(
    ({ children, classNames, leftItems, rightItems, ...props }, ref) => {
        return (
            <SegmentLayoutProvider {...props}>
                <SegmentLayoutContentInner
                    ref={ref}
                    leftItems={leftItems}
                    rightItems={rightItems}
                    classNames={classNames}
                >
                    {children}
                </SegmentLayoutContentInner>
            </SegmentLayoutProvider>
        );
    },
);

type SegmentLayoutContentProps = React.HTMLAttributes<HTMLDivElement> & {
    value: string;
    children: React.ReactNode;
};

const SegmentLayoutContent: React.FC<SegmentLayoutContentProps> = ({
    value,
    className,
    ...props
}) => {
    return (
        <div
            data-slot="segment-layout-content"
            data-active={value}
            className={cn(
                "flex-1 flex items-center justify-center w-full",
                className,
            )}
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
    );
};

const ItemWrapper: React.FC<{
    position: "left" | "right";
    items: ItemType[];
    className?: ClassValue;
    classNames?: Omit<ClassNamesType, "mainWrapper" | "contentWrapper">;
}> = ({ classNames, className, position, items }) => {
    const { isActive, setActive } = useSegmentLayout();

    const getItemClassName = (item: { disabled?: boolean; value: string }) => {
        const baseClass = classNames?.item;
        const activeClass = isActive(item.value)
            ? classNames?.activeItem
            : undefined;
        const disabledClass = item.disabled
            ? classNames?.disabledItem
            : undefined;
        const activePositionClass =
            position === "left"
                ? classNames?.activeLeftItem
                : classNames?.activeRightItem;
        const disabledPositionClass =
            position === "left"
                ? classNames?.disabledLeftItem
                : classNames?.disabledRightItem;

        return cn(
            baseClass,
            activeClass,
            activePositionClass && isActive(item.value) && activePositionClass,
            disabledClass,
            disabledPositionClass && item.disabled && disabledPositionClass,
        );
    };

    return (
        <div
            data-slot="segment-layout-items"
            className={cn("flex flex-col gap-3 w-72 shrink-0", className)}
        >
            {items.map((item) => (
                <Item
                    key={item.value}
                    {...item}
                    position={position}
                    className={getItemClassName(item)}
                    onClick={() => {
                        if (!item.disabled) {
                            setActive(item.value);
                            item.onClick?.();
                        }
                    }}
                />
            ))}
        </div>
    );
};

const Item: React.FC<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: ClassValue;
    position: "left" | "right";
}> = ({ label, icon, value, disabled, onClick, className, position }) => {
    const { isActive } = useSegmentLayout();

    return (
        <motion.button
            data-slot="segment-layout-item"
            data-position={position}
            data-active={isActive(value)}
            data-disabled={disabled}
            data-value={value}
            data-label={label}
            aria-label={label}
            aria-disabled={disabled}
            aria-pressed={isActive(value)}
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={{
                fontWeight: isActive(value) ? "bold" : "normal",
            }}
            whileTap={{
                scale: 0.95,
            }}
            transition={{
                type: "spring",
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
                stiffness: 200,
                damping: 10,
            }}
            className={cn(
                "flex items-center gap-2 w-full flex-1 bg-primary text-primary-foreground p-4 rounded-lg",
                "transition-colors duration-300 ease-in-out text-sm",
                position === "right" ? "justify-end" : "justify-start",
                isActive(value) &&
                    "bg-card text-card-foreground border shadow-lg",
                disabled && "opacity-50 cursor-not-allowed",
                className,
            )}
        >
            {position === "left" && icon && icon}
            {label}
            {position === "right" && icon && icon}
        </motion.button>
    );
};

export {
    SegmentLayout,
    type SegmentLayoutRef,
    type SegmentLayoutProps,
    SegmentLayoutContent,
};
