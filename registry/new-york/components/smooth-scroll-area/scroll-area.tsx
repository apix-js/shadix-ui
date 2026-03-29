"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import Lenis from "lenis";

import { LenisProvider } from "@/registry/new-york/components/smooth-scroll-area/lenis-context";
import Scrollbar from "@/registry/new-york/components/smooth-scroll-area/scrollbar";
import { cn } from "@/shadcn/lib/utils";

interface ScrollAreaProps {
    /** @public Children to render */
    children: React.ReactNode;
    /** @public Additional CSS class names */
    className?: string;
    /** @public Additional CSS class names for the scrollbar */
    scrollbarClassName?: {
        /** @public Additional CSS class names for the scrollbar thumb */
        thumb?: string;
        /** @public Additional CSS class names for the scrollbar track */
        track?: string;
    };
    /** @public Options to pass to Lenis */
    lenisOptions?: ConstructorParameters<typeof Lenis>[0];
}

const ScrollArea: React.FC<ScrollAreaProps> = ({
    children,
    className,
    scrollbarClassName,
    lenisOptions,
}) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return;

        const instance = new Lenis({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
            ...lenisOptions,
        });

        setLenis(instance);

        const raf = (time: number) => {
            instance.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => {
            instance.destroy();
            setLenis(null);
        };
    }, [lenisOptions]);

    return (
        <LenisProvider value={lenis}>
            <div
                data-slot="scroll-area"
                className={cn("relative overflow-hidden", className)}
            >
                <div className="flex h-full min-h-0 w-full min-w-0 flex-row">
                    <div
                        ref={wrapperRef}
                        data-lenis-prevent-wheel=""
                        className="min-h-0 min-w-0 flex-1 overflow-hidden"
                    >
                        <div
                            ref={contentRef}
                            data-slot="scroll-area-viewport"
                            className="min-h-0 w-full"
                        >
                            {children}
                        </div>
                    </div>
                    {lenis ? (
                        <Scrollbar
                            classNames={scrollbarClassName}
                            lenis={lenis}
                        />
                    ) : null}
                </div>
            </div>
        </LenisProvider>
    );
};

export default ScrollArea;
