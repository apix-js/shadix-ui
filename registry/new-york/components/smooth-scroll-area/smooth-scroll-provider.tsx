"use client";
import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";

import Lenis from "lenis";

import { LenisProvider } from "@/registry/new-york/components/smooth-scroll-area/lenis-context";
import Scrollbar from "@/registry/new-york/components/smooth-scroll-area/scrollbar";

interface SmoothScrollProviderProps {
    children: ReactNode;
}

const SmoothScrollProvider: FC<SmoothScrollProviderProps> = ({ children }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const [documentScrollable, setDocumentScrollable] = useState(false);

    useEffect(() => {
        const instance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
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
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        const updateScrollable = () => {
            setDocumentScrollable(root.scrollHeight > root.clientHeight);
        };

        updateScrollable();

        const observer = new ResizeObserver(updateScrollable);
        observer.observe(root);
        if (document.body) observer.observe(document.body);

        window.addEventListener("resize", updateScrollable);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateScrollable);
        };
    }, []);

    return (
        <LenisProvider value={lenis}>
            {children}
            {lenis && documentScrollable ? (
                <Scrollbar lenis={lenis} layout="document" />
            ) : null}
        </LenisProvider>
    );
};

export default SmoothScrollProvider;
