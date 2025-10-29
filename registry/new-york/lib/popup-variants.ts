import type { ReactNode } from "react";

import type { Variant, Variants } from "motion";

export type AnimationVariant =
    | "ripple"
    | "slide"
    | "flip"
    | "blur"
    | "elastic"
    | "pulse"
    | "zoom";

export interface AnimatedDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: ReactNode;
    title: string;
    description?: string;
    children?: ReactNode;
    animation?: AnimationVariant;
    gradient?: string;
    icon?: ReactNode;
    originX?: number;
    originY?: number;
}

export const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

export const animationVariants: Record<
    AnimationVariant,
    {
        hidden: Variant;
        visible: Variant;
        exit: Variant;
    }
> = {
    ripple: {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 18,
                mass: 0.8,
            },
        },
        exit: {
            // scale: 0,
            opacity: 0,
            transition: {
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    },
    slide: {
        hidden: { y: "-100vh", opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        exit: {
            y: "100vh",
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    },
    flip: {
        hidden: { rotateX: -90, opacity: 0 },
        visible: {
            rotateX: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            },
        },
        exit: {
            rotateX: 90,
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    },
    blur: {
        hidden: { scale: 0.8, opacity: 0, filter: "blur(10px)" },
        visible: {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            filter: "blur(10px)",
            transition: {
                duration: 0.3,
            },
        },
    },
    elastic: {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
                mass: 0.5,
            },
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    },
    pulse: {
        hidden: { scale: 0.5, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
            },
        },
        exit: {
            scale: 1.2,
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    },
    zoom: {
        hidden: { scale: 2, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
            },
        },
        exit: {
            scale: 2,
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    },
};
