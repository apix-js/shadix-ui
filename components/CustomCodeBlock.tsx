"use client";

import { useRef, useState } from "react";
import type { ComponentProps } from "react";

import { Pre } from "fumadocs-ui/components/codeblock";

import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { cn } from "@/shadcn/lib/utils";

/**
 * Custom code block component with better mobile responsiveness
 * Handles long URLs and prevents horizontal overflow on mobile devices
 */
export function CustomPre({
    className,
    children,
    ...props
}: ComponentProps<"pre">) {
    const [isCopied, setIsCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    // feat: copy code from the Pre element to clipboard
    const handleCopy = async () => {
        try {
            const text = preRef.current?.textContent || "";
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="relative group">
            <button
                type="button"
                onClick={handleCopy}
                className={cn(
                    "absolute top-2 right-2 z-10 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                    "opacity-0 group-hover:opacity-100",
                    isCopied
                        ? "bg-green-500/20 text-green-700 dark:text-green-400"
                        : "bg-gray-500/20 text-gray-700 dark:text-gray-400 hover:bg-gray-500/30",
                )}
                title={isCopied ? "Copied!" : "Copy code"}
            >
                {isCopied ? "Copied!" : "Copy"}
            </button>
            <ScrollArea className="w-full max-w-svw rounded-lg">
                <Pre
                    ref={preRef}
                    className={cn(
                        "overflow-x-auto bg-code py-3.5 pr-4",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </Pre>
            </ScrollArea>
        </div>
    );
}

/**
 * Optional: Custom code component for inline code
 */
export function CustomCode({
    className,
    children,
    ...props
}: ComponentProps<"code">) {
    return (
        <code
            className={cn(
                "break-words bg-code border-none w-auto flex-wrap", // Allow breaking long words/URLs
                className,
            )}
            {...props}
        >
            {children}
        </code>
    );
}
