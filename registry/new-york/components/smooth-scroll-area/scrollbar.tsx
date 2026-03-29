"use client";
import { useEffect, useRef, useState } from "react";

import type Lenis from "lenis";

import { cn } from "@/shadcn/lib/utils";

interface ScrollbarProps {
    lenis: Lenis | null;
    orientation?: "vertical" | "horizontal";
    layout?: "document" | "embedded";
    classNames?: {
        track?: string;
        thumb?: string;
    };
}

const Scrollbar: React.FC<ScrollbarProps> = ({
    lenis,
    orientation = "vertical",
    layout = "embedded",
    classNames,
}) => {
    const [progress, setProgress] = useState(0);
    const [thumbSize, setThumbSize] = useState(0);
    const [visible, setVisible] = useState(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ y: 0, progress: 0 });
    const hideTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (!lenis) return;

        const onScroll = (instance: Lenis) => {
            const w = instance.options.wrapper;
            let p = instance.progress;
            if (w instanceof HTMLElement) {
                const max = w.scrollHeight - w.clientHeight;
                if (max > 0) {
                    p = w.scrollTop / max;
                }
            }
            setProgress(p);
            setVisible(true);
            clearTimeout(hideTimeout.current);

            hideTimeout.current = setTimeout(() => {
                if (!isDragging.current) setVisible(false);
            }, 1200);
        };

        lenis.on("scroll", onScroll);

        return () => lenis.off("scroll", onScroll);
    }, [lenis]);

    useEffect(() => {
        if (!lenis) return;

        const wrapper =
            lenis.options.wrapper === window
                ? document.documentElement
                : (lenis.options.wrapper as HTMLElement);

        const content = lenis.options.content ?? wrapper;

        const updateThumbSize = () => {
            const viewportSize =
                wrapper === document.documentElement
                    ? window.innerHeight
                    : wrapper.clientHeight;

            const contentSize = content.scrollHeight;

            if (contentSize <= 0) return;

            setThumbSize(Math.max((viewportSize / contentSize) * 100, 5));
        };

        updateThumbSize();

        const observer = new ResizeObserver(updateThumbSize);

        observer.observe(wrapper);

        if (content !== wrapper) observer.observe(content);

        return () => observer.disconnect();
    }, [lenis]);

    const handleTrackClick = (e: React.MouseEvent) => {
        if (
            !lenis ||
            !trackRef.current ||
            (e.target as HTMLElement).closest("button")
        )
            return;

        const rect = trackRef.current.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / rect.height;
        const maxScroll = lenis.limit;

        lenis.scrollTo(ratio * maxScroll, { immediate: true });
    };

    const handleThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        isDragging.current = true;
        dragStart.current = { y: e.clientY, progress };
        document.body.style.userSelect = "none";

        const onMove = (ev: MouseEvent) => {
            if (!trackRef.current || !lenis) return;

            const trackH = trackRef.current.getBoundingClientRect().height;
            const delta = (ev.clientY - dragStart.current.y) / trackH;
            const newProgress = Math.min(
                1,
                Math.max(0, dragStart.current.progress + delta),
            );

            lenis.scrollTo(newProgress * lenis.limit, { immediate: true });
        };

        const onUp = () => {
            isDragging.current = false;
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    };

    const travel = Math.max(100 - thumbSize, 0);
    const thumbTop = progress * travel;

    return (
        <div
            ref={trackRef}
            onClick={handleTrackClick}
            onKeyDown={(e) => {
                if (!lenis) return;
                const step = lenis.limit * 0.05;
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    lenis.scrollTo(lenis.animatedScroll + step);
                } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    lenis.scrollTo(lenis.animatedScroll - step);
                }
            }}
            tabIndex={-1}
            role="scrollbar"
            aria-controls="scroll-area-viewport"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-orientation={orientation}
            data-slot="scroll-area-scrollbar"
            className={cn(
                "flex touch-none select-none transition-opacity duration-300",
                layout === "document"
                    ? orientation === "vertical"
                        ? "fixed top-0 right-0 z-9999 h-full w-1.5 border-l border-l-transparent p-px"
                        : "fixed bottom-0 left-0 z-9999 h-1.5 w-full flex-col border-t border-t-transparent p-px"
                    : orientation === "vertical"
                      ? "relative z-10 flex w-1.5 shrink-0 flex-col self-stretch border-l border-l-transparent p-px"
                      : "relative z-10 flex h-1.5 w-full shrink-0 flex-col border-t border-t-transparent p-px",
                visible ? "opacity-100" : "opacity-0",
                classNames?.track,
            )}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => {
                if (!isDragging.current) setVisible(false);
            }}
        >
            <button
                type="button"
                onMouseDown={handleThumbMouseDown}
                data-slot="scroll-area-thumb"
                className={cn(
                    "relative rounded-full bg-border transition-colors hover:bg-muted-foreground/50",
                    isDragging.current ? "bg-muted-foreground/50" : "",
                    classNames?.thumb,
                )}
                style={{
                    position: "absolute",
                    top: `${thumbTop}%`,
                    height: `${thumbSize}%`,
                    width: "100%",
                }}
            />
        </div>
    );
};

export default Scrollbar;
