"use client";

import { AnimatePresence } from "framer-motion";

import {
    MotionDialog,
    MotionDialogBody,
    MotionDialogClose,
    MotionDialogContent,
    MotionDialogDescription,
    MotionDialogFooter,
    MotionDialogHeader,
    MotionDialogTitle,
    MotionDialogTrigger,
} from "@/registry/new-york/components/motion-dialog";
import { Button } from "@/shadcn/components/ui/button";

// feat: Create demo component showcasing all animation variants
export default function AnimatedDialogDemo() {
    return (
        <div className="mt-10 flex items-center justify-center h-auto">
            <AnimatePresence mode="wait">
                <MotionDialog animation="elastic">
                    <MotionDialogTrigger asChild>
                        <Button>Open Dialog</Button>
                    </MotionDialogTrigger>
                    <MotionDialogContent>
                        <MotionDialogHeader>
                            <MotionDialogTitle>Dialog Title</MotionDialogTitle>
                            <MotionDialogDescription>
                                Dialog Description
                            </MotionDialogDescription>
                        </MotionDialogHeader>
                        <MotionDialogBody>
                            <p>Dialog Body</p>
                        </MotionDialogBody>
                        <MotionDialogFooter>
                            <Button>Action</Button>
                            <MotionDialogClose asChild>
                                <Button>Close</Button>
                            </MotionDialogClose>
                        </MotionDialogFooter>
                    </MotionDialogContent>
                </MotionDialog>
            </AnimatePresence>
        </div>
    );
}
