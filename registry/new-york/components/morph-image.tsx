"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type React from "react";

import { AnimatePresence, motion, type Transition } from "motion/react";

import { useClickOutside } from "@/registry/new-york/hooks/useClickOutside";
import { useEventListener } from "@/registry/new-york/hooks/useEventListener";
import { cn } from "@/shadcn/lib/utils";

const transition: Transition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
    type: "spring",
    stiffness: 120,
    damping: 15,
};

const MorphImage: React.FC<
    Omit<React.ComponentProps<typeof motion.img>, "onClick">
> = ({ src, className, alt, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    useClickOutside({
        ref: imageRef,
        callback: () => setIsOpen(false),
    });

    useEventListener("scroll", () => isOpen && setIsOpen(false));

    const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    if (!mounted) return null;

    const thumbnail = (
        <motion.img
            src={src}
            alt={alt}
            layoutId="morph-image"
            className={cn(
                "w-full h-full object-cover object-center not-prose cursor-zoom-in",
                className,
            )}
            onClick={() => setIsOpen(true)}
            transition={transition}
            {...props}
        />
    );

    const modal = createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={transition}

                        // onClick={handleClick}
                    />
                    <motion.div
                        key="container"
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={transition}
                    >
                        <motion.img
                            ref={imageRef as React.RefObject<HTMLImageElement>}
                            src={src}
                            alt={alt}
                            layoutId="morph-image"
                            className={cn(
                                "object-cover object-center max-w-[90vw] max-h-[90vh] pointer-events-auto cursor-zoom-out",
                            )}
                            onClick={(e) => handleClick(e)}
                            transition={transition}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );

    return (
        <div className="w-fit flex items-center justify-center">
            <picture>{thumbnail}</picture>
            {modal}
        </div>
    );
};

export default MorphImage;
