"use client";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
    type AnimationVariant,
    animationVariants,
    overlayVariants,
} from "@/registry/new-york/lib/popup-variants";
import { cn } from "@/shadcn/lib/utils";

interface MotionDialogContextProps {
    /** @public (required) The animation variant to use */
    animation: AnimationVariant;
    /** @public (required) Whether the dialog is open */
    show: boolean;
    /** @public (required) Whether the dialog is animating */
    isAnimating: boolean;
}

interface MotionDialogProps
    extends React.ComponentProps<typeof DialogPrimitive.Root> {
    /** @public The animation variant to use */
    animation?: AnimationVariant;
    /** @public Whether the dialog is open */
    show?: boolean;
    /** @public Whether the dialog is animating */
    isAnimating?: boolean;
}

const MotionDialogContext = createContext<MotionDialogContextProps>({
    animation: "ripple",
    show: false,
    isAnimating: false,
});

const MotionDialog: React.FC<MotionDialogProps> = ({
    animation = "ripple",
    ...props
}) => {
    const { open, onOpenChange, isAnimating } = useMotionDialog();

    return (
        <MotionDialogContext.Provider
            value={{ animation, show: open, isAnimating }}
        >
            <AnimatePresence mode="sync">
                <DialogPrimitive.Root
                    data-slot="motion-dialog"
                    open={open}
                    onOpenChange={onOpenChange}
                    {...props}
                />
            </AnimatePresence>
        </MotionDialogContext.Provider>
    );
};

const MotionDialogTrigger: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Trigger>
> = (props) => {
    return (
        <DialogPrimitive.Trigger data-slot="motion-dialog-trigger" {...props} />
    );
};

const MotionDialogPortal: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Portal>
> = (props) => {
    return (
        <DialogPrimitive.Portal data-slot="motion-dialog-portal" {...props} />
    );
};

const MotionDialogClose: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Close>
> = (props) => {
    return <DialogPrimitive.Close data-slot="motion-dialog-close" {...props} />;
};

const MotionDialogOverlay: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Overlay & typeof motion.div>
> = ({ className, ...props }) => {
    const { show, isAnimating } = useContext(MotionDialogContext);
    return (
        <DialogPrimitive.Overlay data-slot="motion-dialog-overlay" asChild>
            <AnimatePresence mode="wait">
                {show && (
                    <motion.div
                        className={cn(
                            "fixed inset-0 z-50 bg-black/80",
                            className,
                        )}
                        variants={overlayVariants}
                        initial="hidden"
                        animate={isAnimating ? "exit" : "visible"}
                        exit="exit"
                        {...props}
                    />
                )}
            </AnimatePresence>
        </DialogPrimitive.Overlay>
    );
};

const MotionDialogContent: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Content & "div">
> = ({ className, children, ...props }) => {
    const { animation, show, isAnimating } = useContext(MotionDialogContext);
    const selectedVariants = useMemo(
        () => animationVariants[animation],
        [animation],
    );

    return (
        <MotionDialogPortal>
            <MotionDialogOverlay />
            <DialogPrimitive.Content data-slot="motion-dialog-content" asChild>
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    {...props}
                >
                    <AnimatePresence mode="wait">
                        {show && (
                            <motion.div
                                className={cn(
                                    "bg-background rounded-lg shadow-lg max-w-md w-full pointer-events-auto overflow-hidden p-6 relative",
                                    className,
                                )}
                                variants={selectedVariants}
                                initial="hidden"
                                animate={isAnimating ? "exit" : "visible"}
                                exit="exit"
                            >
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogPrimitive.Content>
        </MotionDialogPortal>
    );
};

const MotionDialogHeader: React.FC<
    React.ComponentProps<"div"> & { showCloseButton?: boolean }
> = ({ className, children, showCloseButton = true, ...props }) => {
    return (
        <div
            data-slot="motion-dialog-header"
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                className,
            )}
            {...props}
        >
            {children as React.ReactNode}

            {showCloseButton && (
                <MotionDialogClose
                    className={cn(
                        "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                    )}
                >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </MotionDialogClose>
            )}
        </div>
    );
};

const MotionDialogTitle: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Title & "h2">
> = ({ className, ...props }) => {
    return (
        <DialogPrimitive.Title data-slot="motion-dialog-title" asChild>
            <h2
                className={cn(
                    "text-lg font-semibold leading-none tracking-tight",
                    className,
                )}
                {...props}
            />
        </DialogPrimitive.Title>
    );
};

const MotionDialogDescription: React.FC<
    React.ComponentProps<typeof DialogPrimitive.Description & "p">
> = ({ className, ...props }) => {
    return (
        <DialogPrimitive.Description
            data-slot="motion-dialog-description"
            asChild
        >
            <p
                className={cn("text-sm text-muted-foreground", className)}
                {...props}
            />
        </DialogPrimitive.Description>
    );
};

const MotionDialogFooter: React.FC<React.ComponentProps<"div">> = ({
    className,
    ...props
}) => {
    return (
        <div
            data-slot="motion-dialog-footer"
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className,
            )}
            {...props}
        />
    );
};

const MotionDialogBody: React.FC<React.ComponentProps<"div">> = ({
    className,
    ...props
}) => {
    return (
        <div
            data-slot="motion-dialog-body"
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left relative py-4",
                className,
            )}
            {...props}
        />
    );
};

const useMotionDialog = () => {
    const [open, setOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        if (!newOpen) {
            // Start exit animation
            setIsAnimating(true);
            // Keep dialog open during animation, close after
            setTimeout(() => {
                setOpen(false);
                setIsAnimating(false);
            }, 300); // Match your animation duration
        } else {
            setOpen(newOpen);
            setIsAnimating(false);
        }
    }, []);

    return { open, onOpenChange: handleOpenChange, isAnimating };
};

export {
    MotionDialog,
    MotionDialogTrigger,
    MotionDialogPortal,
    MotionDialogClose,
    MotionDialogOverlay,
    MotionDialogContent,
    MotionDialogHeader,
    MotionDialogTitle,
    MotionDialogDescription,
    MotionDialogFooter,
    MotionDialogBody,
};
