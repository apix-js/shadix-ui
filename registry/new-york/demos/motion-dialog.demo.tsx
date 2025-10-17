import type React from "react";

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

const MotionDialogDemo: React.FC<Record<string, never>> = () => {
    return (
        <MotionDialog animation="blur">
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
    );
};

export default MotionDialogDemo;
