"use client";
import { useTransition } from "react";
import type React from "react";

import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";
import { Button } from "@/shadcn/components/ui/button";

const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    popupContent,
    title,
    onConfirm,
    ...props
}) => {
    const [isLoading, startLoading] = useTransition();

    const handleConfirm = () => {
        startLoading(async () => {
            const data = await onConfirm();
            if (data.error) toast.error(data.message ?? "Something went wrong");
            else toast.success(data.message ?? "Action successful");
        });
    };

    return (
        <AlertDialog open={isLoading ? true : undefined}>
            <AlertDialogTrigger asChild>
                <Button {...props}>{children}</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription asChild>
                        {popupContent}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={handleConfirm}
                    >
                        {isLoading ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            "Confirm"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export interface ActionButtonProps extends React.ComponentProps<typeof Button> {
    /** @public Button content */
    children: React.ReactNode;
    /** @public Content to show in popup */
    popupContent: React.ReactNode;
    /** @public Additional CSS class names */
    className?: string;
    /** @public Variant of the button */
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    /** @public Size of the button */
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
    /** @public Whether the button is disabled */
    disabled?: boolean;
    /** @public Function to execute on confirmation */
    onConfirm: () => Promise<{
        message?: string;
        error?: boolean;
    }>;
}

export default ActionButton;
