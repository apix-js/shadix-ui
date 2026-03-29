import type React from "react";

import ScrollArea from "@/registry/new-york/components/smooth-scroll-area/scroll-area";
import { cn } from "@/shadcn/lib/utils";

const SmoothScrollAreaDemo: React.FC = () => {
    return (
        <div className="flex h-[400px] w-full items-center justify-center gap-10 p-10">
            <div className="flex h-full flex-col gap-2">
                <h3 className="font-bold text-xl">Default</h3>
                <ScrollArea className="rounded-md bg-muted p-4">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Maxime, ratione. Rerum vitae quis natus est nihil
                        excepturi omnis, fugiat accusantium placeat cumque ab
                        nemo, ad possimus repellendus doloribus, laboriosam
                        perferendis! Libero recusandae dignissimos nam quisquam
                        aliquid voluptate enim nesciunt. Hic odio voluptatibus
                        praesentium. Reprehenderit assumenda deserunt placeat
                        asperiores reiciendis odit fugit, expedita nam hic
                        architecto eos voluptas dicta. Nisi, inventore?
                        Adipisci, rerum architecto odit hic at sint? Error
                        dolores, inventore rerum totam sit cum similique velit,
                        itaque, corrupti blanditiis adipisci pariatur quod quo
                        eligendi ipsam! Veritatis iste obcaecati laboriosam
                        iusto! Tempora vel quod deleniti qui! Deserunt sed
                        cumque a debitis labore blanditiis rerum numquam
                        accusantium, saepe, dolorum adipisci error tempore.
                        Reiciendis sint quo quod ducimus provident accusamus, at
                        ratione architecto. Aperiam tempore at quas dicta
                        pariatur, est dignissimos. Eos praesentium quia magnam
                        sint? Deserunt vel aspernatur laborum aut totam libero
                        pariatur? Beatae sequi at voluptates quisquam. Ipsam
                        tempore labore et.
                    </p>
                </ScrollArea>
            </div>

            <div className="flex h-full flex-col gap-2">
                <h3 className="font-bold text-xl">Custom Styles</h3>
                <ScrollArea
                    className="rounded-md bg-muted p-4"
                    scrollbarClassName={{
                        track: cn("w-2.5"),
                        thumb: cn("bg-gradient-to-b from-blue-200 to-blue-500"),
                    }}
                >
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Maxime, ratione. Rerum vitae quis natus est nihil
                        excepturi omnis, fugiat accusantium placeat cumque ab
                        nemo, ad possimus repellendus doloribus, laboriosam
                        perferendis! Libero recusandae dignissimos nam quisquam
                        aliquid voluptate enim nesciunt. Hic odio voluptatibus
                        praesentium. Reprehenderit assumenda deserunt placeat
                        asperiores reiciendis odit fugit, expedita nam hic
                        architecto eos voluptas dicta. Nisi, inventore?
                        Adipisci, rerum architecto odit hic at sint? Error
                        dolores, inventore rerum totam sit cum similique velit,
                        itaque, corrupti blanditiis adipisci pariatur quod quo
                        eligendi ipsam! Veritatis iste obcaecati laboriosam
                        iusto! Tempora vel quod deleniti qui! Deserunt sed
                        cumque a debitis labore blanditiis rerum numquam
                        accusantium, saepe, dolorum adipisci error tempore.
                        Reiciendis sint quo quod ducimus provident accusamus, at
                        ratione architecto. Aperiam tempore at quas dicta
                        pariatur, est dignissimos. Eos praesentium quia magnam
                        sint? Deserunt vel aspernatur laborum aut totam libero
                        pariatur? Beatae sequi at voluptates quisquam. Ipsam
                        tempore labore et.
                    </p>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SmoothScrollAreaDemo;
