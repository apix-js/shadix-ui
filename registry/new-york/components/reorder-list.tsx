"use client";
import React, { useState } from "react";

import { Grip } from "lucide-react";
import { Reorder, useDragControls, useMotionValue } from "motion/react";

import { useRaisedShadow } from "@/registry/new-york/hooks/useRaisedShadow";
import { cn } from "@/shadcn/lib/utils";

const ReorderList: React.FC<ReorderListProps> = ({
    className,
    itemClassName,
    withDragHandle = false,
    onReorderFinish,
    ...props
}) => {
    const [items, setItems] = useState<React.ReactElement[]>(
        React.Children.toArray(props.children).filter((child) =>
            React.isValidElement(child),
        ) as React.ReactElement[],
    );

    const handleReorderFinish = (newOrder: unknown[]) => {
        setItems(newOrder as React.ReactElement[]);
        onReorderFinish?.(newOrder as React.ReactElement[]);
    };

    return (
        <Reorder.Group
            data-slot="reorder-list-group"
            axis="y"
            className={cn(
                "flex flex-col gap-1 select-none list-none !p-0 !m-0",
                className,
            )}
            values={items}
            onReorder={handleReorderFinish}
            {...props}
        >
            {items.map((item, index) => (
                <ReorderListItem
                    key={item?.key || index}
                    item={item}
                    withDragHandle={withDragHandle}
                    className={itemClassName}
                />
            ))}
        </Reorder.Group>
    );
};

const ReorderListItem: React.FC<{
    item: React.ReactElement;
    className?: string;
    withDragHandle?: boolean;
}> = ({ item, className, withDragHandle = false }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            data-slot="reorder-list-item"
            id={item?.key ?? ""}
            value={item}
            className={cn(
                "bg-background list-none !p-0 !m-0",
                !withDragHandle ? "cursor-grab" : "",
                className,
            )}
            style={{ boxShadow, y }}
            dragListener={!withDragHandle}
            dragControls={withDragHandle ? dragControls : undefined}
        >
            {withDragHandle ? (
                <div className="relative flex items-center gap-2">
                    {React.isValidElement<{ className?: string }>(item)
                        ? React.cloneElement(item, {
                              className: cn(
                                  "pr-12 w-full",
                                  item.props.className,
                              ),
                          })
                        : item}
                    <Grip
                        className="size-6 absolute cursor-grab right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onPointerDown={(e) => dragControls.start(e)}
                    />
                </div>
            ) : (
                item
            )}
        </Reorder.Item>
    );
};

export interface ReorderListProps
    extends Partial<React.ComponentProps<typeof Reorder.Group>> {
    /** @public (required) - The children of the list */
    children: React.ReactElement[];
    /** @public (optional) - The className of the list */
    className?: string;
    /** @public (optional) - The className of the item */
    itemClassName?: string;
    /** @public (optional) - With drag handle */
    withDragHandle?: boolean;
    /** @public (optional) - When the list is reordered */
    onReorderFinish?: (newOrder: React.ReactElement[]) => void;
}

export { ReorderList };
