"use client";
import type React from "react";

import { TrashIcon } from "lucide-react";

import { ReorderList } from "@/registry/new-york/components/reorder-list";
import { Button } from "@/shadcn/components/ui/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemTitle,
} from "@/shadcn/components/ui/item";

const ReorderListDemo: React.FC = () => {
    const handleReorderFinish = (newOrder: React.ReactElement[]) => {
        console.log(newOrder);
    };

    return (
        <div className="flex items-start justify-center gap-16">
            <div className="">
                <h2 className="text-2xl text-muted-foreground font-bold mb-4">
                    Default
                </h2>

                <ReorderList
                    onReorderFinish={handleReorderFinish}
                    itemClassName="rounded-lg"
                    className="min-w-[200px]"
                >
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 1</ItemTitle>
                        </ItemContent>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 2</ItemTitle>
                        </ItemContent>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 3</ItemTitle>
                        </ItemContent>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 4</ItemTitle>
                        </ItemContent>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 5</ItemTitle>
                        </ItemContent>
                    </Item>
                </ReorderList>
            </div>

            <div>
                <h2 className="text-2xl text-muted-foreground font-bold mb-4">
                    With Drag Handle
                </h2>

                <ReorderList
                    onReorderFinish={handleReorderFinish}
                    withDragHandle
                    itemClassName="rounded-lg"
                    className="min-w-[300px]"
                >
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 1</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button variant={"ghost"} size={"icon-sm"}>
                                <TrashIcon />
                            </Button>
                        </ItemActions>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 2</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button variant={"ghost"} size={"icon-sm"}>
                                <TrashIcon />
                            </Button>
                        </ItemActions>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 3</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button variant={"ghost"} size={"icon-sm"}>
                                <TrashIcon />
                            </Button>
                        </ItemActions>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 4</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button variant={"ghost"} size={"icon-sm"}>
                                <TrashIcon />
                            </Button>
                        </ItemActions>
                    </Item>
                    <Item variant={"outline"} size={"sm"}>
                        <ItemContent>
                            <ItemTitle>Reorder List Item 5</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Button variant={"ghost"} size={"icon-sm"}>
                                <TrashIcon />
                            </Button>
                        </ItemActions>
                    </Item>
                </ReorderList>
            </div>
        </div>
    );
};

export default ReorderListDemo;
