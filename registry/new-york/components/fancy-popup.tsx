import { createContext, useContext, useMemo } from "react";
import type * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    type LegacyAnimationControls,
    motion,
    type TargetAndTransition,
    type Transition,
    type VariantLabels,
} from "framer-motion";
import { XIcon } from "lucide-react";

import {
    type AnimationVariant,
    animationVariants,
    overlayVariants,
} from "@/registry/new-york/lib/popup-variants";
import { cn } from "@/shadcn/lib/utils";

export type FancyDialogContentProps = React.ComponentProps<
    typeof DialogPrimitive.Content & typeof motion.div
> & {
    showCloseButton?: boolean;
    animation?: AnimationVariant;
    gradient?: string;
    icon?: React.ReactNode;
    originX?: number;
    originY?: number;
};

type FancyPopupContextProps = {
    animation: AnimationVariant;
};

type GetAnimationVariants = {
    initial?:
        | TargetAndTransition
        | VariantLabels
        | LegacyAnimationControls
        | undefined;
    animate?:
        | TargetAndTransition
        | VariantLabels
        | LegacyAnimationControls
        | undefined;
    transition?: Transition;
    exit?:
        | TargetAndTransition
        | VariantLabels
        | LegacyAnimationControls
        | undefined;
};

const getHeaderAnimation = (
    animation: AnimationVariant,
): GetAnimationVariants => {
    switch (animation) {
        case "slide":
            return {
                initial: {
                    opacity: 0,
                    y: -20,
                },
                animate: {
                    opacity: 1,
                    y: 0,
                },
                transition: {
                    delay: 0.1,
                    duration: 0.4,
                    ease: "easeOut",
                },
            };
        case "flip":
            return {
                initial: {
                    opacity: 0,
                    rotateX: -45,
                },
                animate: {
                    opacity: 1,
                    rotateX: 0,
                },
                transition: {
                    delay: 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                },
            };
        case "blur":
            return {
                initial: {
                    opacity: 0,
                    filter: "blur(5px)",
                },
                animate: {
                    opacity: 1,
                    filter: "blur(0px)",
                },
                transition: {
                    delay: 0.1,
                    duration: 0.4,
                },
            };
        default:
            return {
                initial: {
                    opacity: 0,
                    scale: 0.9,
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                },
                transition: {
                    delay: 0.1,
                    duration: 0.3,
                    ease: "easeOut",
                },
            };
    }
};

const getFooterAnimation = (
    animation: AnimationVariant,
): GetAnimationVariants => {
    switch (animation) {
        case "slide":
            return {
                initial: {
                    opacity: 0,
                    y: 20,
                },
                animate: {
                    opacity: 1,
                    y: 0,
                },
                transition: {
                    delay: 0.3,
                    duration: 0.4,
                    ease: "easeOut",
                },
            };
        case "elastic":
            return {
                initial: {
                    opacity: 0,
                    scale: 0.8,
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                },
                transition: {
                    delay: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                },
            };
        default:
            return {
                initial: {
                    opacity: 0,
                    y: 10,
                },
                animate: {
                    opacity: 1,
                    y: 0,
                },
                transition: {
                    delay: 0.3,
                    duration: 0.3,
                    ease: "easeOut",
                },
            };
    }
};

const getTitleAnimation = (
    animation: AnimationVariant,
): GetAnimationVariants => {
    switch (animation) {
        case "pulse":
            return {
                initial: {
                    opacity: 0,
                    scale: 0.5,
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        delay: 0.15,
                        duration: 0.6,
                        ease: [0.34, 1.56, 0.64, 1],
                    },
                },
            };
        case "zoom":
            return {
                initial: {
                    opacity: 0,
                    scale: 2,
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        delay: 0.15,
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                    },
                },
            };
        default:
            return {
                initial: {
                    opacity: 0,
                    scale: 0.9,
                },
                animate: {
                    opacity: 1,
                    scale: 1,
                },
                transition: {
                    delay: 0.15,
                    duration: 0.3,
                    ease: "easeOut",
                },
            };
    }
};

const getDescriptionAnimation = (
    animation: AnimationVariant,
): GetAnimationVariants => {
    switch (animation) {
        case "blur":
            return {
                initial: {
                    opacity: 0,
                    filter: "blur(3px)",
                },
                animate: {
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                        delay: 0.2,
                        duration: 0.4,
                    },
                },
            };
        case "flip":
            return {
                initial: {
                    opacity: 0,
                    rotateY: -30,
                },
                animate: {
                    opacity: 1,
                    rotateY: 0,
                    transition: {
                        delay: 0.2,
                        duration: 0.4,
                        ease: "easeOut",
                    },
                },
            };
        default:
            return {
                initial: {
                    opacity: 0,
                    y: 5,
                },
                animate: {
                    opacity: 1,
                    y: 0,
                },
                transition: {
                    delay: 0.2,
                    duration: 0.3,
                    ease: "easeOut",
                },
            };
    }
};

const FancyPopupContext = createContext<FancyPopupContextProps>({
    animation: "ripple",
});

function FancyPopup({
    animation = "ripple",
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
    animation?: AnimationVariant;
}) {
    return (
        <FancyPopupContext.Provider
            value={{
                animation,
            }}
        >
            <DialogPrimitive.Root data-slot="fancy-popup" {...props} />
        </FancyPopupContext.Provider>
    );
}

function FancyPopupTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return (
        <DialogPrimitive.Trigger data-slot="fancy-popup-trigger" {...props} />
    );
}

function FancyPopupPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="fancy-popup-portal" {...props} />;
}

function FancyPopupClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="fancy-popup-close" {...props} />;
}

function FancyPopupOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay & typeof motion.div>) {
    return (
        <DialogPrimitive.Overlay data-slot="fancy-popup-overlay" asChild>
            <motion.div
                className={cn("fixed inset-0 z-50 bg-black/80 ", className)}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                {...props}
            />
        </DialogPrimitive.Overlay>
    );
}

function FancyPopupContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: FancyDialogContentProps) {
    const { animation } = useContext(FancyPopupContext);

    const selectedVariants = useMemo(
        () => animationVariants[animation],
        [animation],
    );

    return (
        <FancyPopupPortal>
            <FancyPopupOverlay />
            <DialogPrimitive.Content asChild>
                <motion.div
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                        className,
                    )}
                    variants={selectedVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    {...props}
                >
                    {children as React.ReactNode}

                    {showCloseButton && (
                        <FancyPopupClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </FancyPopupClose>
                    )}
                </motion.div>
            </DialogPrimitive.Content>
        </FancyPopupPortal>
    );
}

function FancyPopupHeader({
    className,
    animation = "ripple",
    children,
    ...props
}: React.ComponentProps<typeof motion.div> & {
    animation?: AnimationVariant;
}) {
    const headerAnimation = getHeaderAnimation(animation);

    return (
        <motion.div
            className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                className,
            )}
            {...headerAnimation}
            {...props}
        >
            {children}
        </motion.div>
    );
}

function FancyPopupFooter({
    className,
    animation = "ripple",
    ...props
}: React.ComponentProps<typeof motion.div> & {
    animation?: AnimationVariant;
}) {
    const footerAnimation = getFooterAnimation(animation);

    return (
        <motion.div
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className,
            )}
            {...props}
            {...footerAnimation}
        ></motion.div>
    );
}

function FancyPopupTitle({
    className,
    animation = "ripple",
    ...props
}: React.ComponentProps<typeof motion.h2> & {
    animation?: AnimationVariant;
}) {
    const titleAnimation = getTitleAnimation(animation);

    return (
        <DialogPrimitive.Title asChild>
            <motion.h2
                className={cn(
                    "text-lg font-semibold leading-none tracking-tight",
                    className,
                )}
                {...titleAnimation}
                {...props}
            />
        </DialogPrimitive.Title>
    );
}

function FancyPopupDescription({
    className,
    animation = "ripple",
    ...props
}: React.ComponentProps<typeof motion.p> & {
    animation?: AnimationVariant;
}) {
    const descriptionAnimation = getDescriptionAnimation(animation);

    return (
        <DialogPrimitive.Description asChild>
            <motion.p
                className={cn("text-sm text-muted-foreground", className)}
                {...descriptionAnimation}
                {...props}
            />
        </DialogPrimitive.Description>
    );
}

export {
    FancyPopup,
    FancyPopupTrigger,
    FancyPopupPortal,
    FancyPopupClose,
    FancyPopupOverlay,
    FancyPopupContent,
    FancyPopupHeader,
    FancyPopupFooter,
    FancyPopupTitle,
    FancyPopupDescription,
};
