"use client";

import React, {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

import {
    AnimatePresence,
    MotionConfig,
    motion,
    type Transition,
} from "framer-motion";
import { XIcon } from "lucide-react";

import { useClickOutside } from "@/registry/new-york/hooks/useClickOutside";
import { Button } from "@/shadcn/components/ui/button";
import { cn } from "@/shadcn/lib/utils";

type ExpandableCardContextType = {
    isOpen: boolean;
    uniqueId: string;
    triggerRef: React.RefObject<HTMLElement | null>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExpandableCardContext = createContext<ExpandableCardContextType | null>(
    null,
);

const useExpandableCardContext = () => {
    const context = useContext(ExpandableCardContext);
    if (!context) {
        throw new Error(
            "useExpandableCardContext must be used within a ExpandableCardProvider",
        );
    }
    return context;
};

const MotionButton = motion.create(Button);

interface IExpandableCardProviderProps {
    children: React.ReactNode;
    transition?: Transition;
}

export const ExpandableCardProvider: React.FC<IExpandableCardProviderProps> = ({
    children,
    transition,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const uniqueId = useId();

    const triggerRef = useRef<HTMLElement | null>(null);

    const contextValue = useMemo(
        () => ({
            isOpen,
            uniqueId,
            triggerRef,
            setIsOpen,
        }),
        [isOpen, uniqueId],
    );

    return (
        <ExpandableCardContext.Provider value={contextValue}>
            <MotionConfig transition={transition}>{children}</MotionConfig>
        </ExpandableCardContext.Provider>
    );
};

interface IExpandableCardProps {
    children: React.ReactNode;
    transition?: Transition;
}

const ExpandableCard: React.FC<IExpandableCardProps> = ({
    children,
    transition,
}) => {
    const childArray = React.Children.toArray(children);
    return (
        <ExpandableCardProvider>
            <MotionConfig transition={transition}>
                {childArray.map((child) => child)}
            </MotionConfig>
        </ExpandableCardProvider>
    );
};

interface IExpandableCardBodyProps
    extends React.ComponentProps<typeof motion.div> {
    children: React.ReactNode;
    className?: string;
}

const ExpandableCardBody = forwardRef<HTMLDivElement, IExpandableCardBodyProps>(
    ({ children, className, ...props }, ref) => {
        const { isOpen, setIsOpen, uniqueId } = useExpandableCardContext();

        const handleClick = useCallback(() => {
            setIsOpen(true);
        }, [setIsOpen]);

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsOpen((prev) => !prev);
                }
            },
            [setIsOpen],
        );

        return (
            <motion.div
                ref={ref}
                data-slot="expandable-card-body"
                layoutId={`card-${uniqueId}`}
                className={cn(
                    "relative bg-card text-card-foreground flex flex-col rounded-xl overflow-hidden shadow-sm pb-2",
                    className,
                )}
                onClick={() => handleClick()}
                onKeyDown={(event) => handleKeyDown(event)}
                aira-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={`shadix-ui-expandable-card-${uniqueId}`}
                {...props}
            >
                {children}
            </motion.div>
        );
    },
);

interface IExpandableCardContentProps
    extends React.ComponentProps<typeof motion.div> {
    children: React.ReactNode;
    className?: string;
}

const ExpandableCardContent: React.FC<IExpandableCardContentProps> = ({
    children,
    className,
    ...props
}) => {
    const { uniqueId } = useExpandableCardContext();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                layoutId={`card-content-${uniqueId}`}
                className={cn("overflow-hidden p-4", className)}
                aria-modal="true"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                    ease: "easeIn",
                    duration: 0.3,
                    delay: 0.2,
                }}
                aria-labelledby={`shadix-ui-expandable-card-${uniqueId}-title`}
                aria-describedby={`shadix-ui-expandable-card-${uniqueId}-description`}
                {...props}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

interface IExpandableCardExpandContainerProps {
    children: React.ReactNode;
    className?: string;
}

const ExpandableCardExpandContainer: React.FC<
    IExpandableCardExpandContainerProps
> = ({ children, className }) => {
    const { isOpen, uniqueId, setIsOpen } = useExpandableCardContext();
    const [mounted, setMounted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        ref: containerRef,
        callback: () => {
            setIsOpen(false);
        },
    });

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence initial={false} mode="sync">
            {isOpen && (
                <>
                    <motion.div
                        data-slot="expandable-card-expand-container"
                        key={`expandable-backdrop-${uniqueId}`}
                        className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-xs dark:bg-black/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center max-w-2xl mx-auto h-fit my-auto pointer-events-none ">
                        <ExpandableCardBody
                            ref={containerRef}
                            className={cn("pointer-events-auto", className)}
                        >
                            {children}
                        </ExpandableCardBody>

                        <ExpandableCardCloseButton />
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
};

interface IExpandableCardTitleProps
    extends React.ComponentProps<typeof motion.h2> {
    children: React.ReactNode;
    className?: string;
}

const ExpandableCardTitle: React.FC<IExpandableCardTitleProps> = ({
    className,
    children,
    ...props
}) => {
    const { uniqueId } = useExpandableCardContext();

    return (
        <motion.h2
            layout="position"
            layoutId={`card-title-${uniqueId}`}
            className={cn(
                "text-lg font-semibold leading-6 tracking-tight p-0 px-4 !m-0 !mt-2",
                className,
            )}
            {...props}
        >
            {children}
        </motion.h2>
    );
};

interface IExpandableCardDescriptionProps
    extends React.ComponentProps<typeof motion.h3> {
    children: React.ReactNode;
    className?: string;
}

const ExpandableCardDescription: React.FC<IExpandableCardDescriptionProps> = ({
    className,
    children,
    ...props
}) => {
    const { uniqueId } = useExpandableCardContext();

    return (
        <motion.h3
            id={`card-description-${uniqueId}`}
            layout="position"
            layoutId={`card-description-${uniqueId}`}
            className={cn("text-sm text-muted-foreground px-4", className)}
            {...props}
        >
            {children}
        </motion.h3>
    );
};

interface IExpandableCardImageProps
    extends React.ComponentProps<typeof motion.img> {
    className?: string;
}

const ExpandableCardImage: React.FC<IExpandableCardImageProps> = ({
    className,
    ...props
}) => {
    const { uniqueId } = useExpandableCardContext();
    return (
        <motion.img
            layoutId={`card-image-${uniqueId}`}
            layout
            className={cn(
                "w-full h-full object-cover object-top not-prose",
                className,
            )}
            {...props}
        />
    );
};

interface IExpandableCardCloseButtonProps
    extends React.ComponentProps<typeof MotionButton> {}

const ExpandableCardCloseButton: React.FC<IExpandableCardCloseButtonProps> = ({
    className,
    children,
    ...props
}) => {
    const { setIsOpen, uniqueId } = useExpandableCardContext();

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <MotionButton
            layout="position"
            layoutId={`card-close-button-${uniqueId}`}
            onClick={handleClose}
            aria-label="Close"
            size={"icon-sm"}
            className={cn(
                "flex absolute top-2 right-2 items-center justify-center rounded-full pointer-events-auto",
                "bg-background/50 hover:bg-background/70 text-foreground/60 cursor-pointer z-[60]",
                className,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: -0.2 } }}
            transition={{ duration: 0.2, delay: 0.3 }}
            {...props}
        >
            {children ?? <XIcon />}
        </MotionButton>
    );
};

ExpandableCard.displayName = "ExpandableCard";
ExpandableCardBody.displayName = "ExpandableCardBody";
ExpandableCardContent.displayName = "ExpandableCardContent";
ExpandableCardExpandContainer.displayName = "ExpandableCardExpandContainer";
ExpandableCardTitle.displayName = "ExpandableCardTitle";
ExpandableCardDescription.displayName = "ExpandableCardDescription";
ExpandableCardImage.displayName = "ExpandableCardImage";
ExpandableCardCloseButton.displayName = "ExpandableCardCloseButton";

export {
    ExpandableCard,
    ExpandableCardBody,
    ExpandableCardContent,
    ExpandableCardExpandContainer,
    ExpandableCardTitle,
    ExpandableCardDescription,
    ExpandableCardImage,
    ExpandableCardCloseButton,
};
