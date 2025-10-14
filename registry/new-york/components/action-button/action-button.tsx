'use client'
import React, { useTransition } from 'react'

import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

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
} from '@/shadcn/components/ui/alert-dialog'
import { Button } from '@/shadcn/components/ui/button'

const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    popupContent,
    title,
    onConfirm,
    ...props
}) => {
    const [isLoading, startLoading] = useTransition()

    const handleConfirm = () => {
        startLoading(async () => {
            const data = await onConfirm()
            if (data.error) toast.error(data.message ?? 'Something went wrong')
            else toast.success(data.message ?? 'Action successful')
        })
    }

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
                            <Loader2Icon className='size-4 animate-spin' />
                        ) : (
                            'Confirm'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
    children: React.ReactNode // Button content
    popupContent: React.ReactNode // Content to show in popup
    className?: string
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
    disabled?: boolean
    onConfirm: () => Promise<{
        message?: string
        error?: boolean
    }>
}

export default ActionButton
