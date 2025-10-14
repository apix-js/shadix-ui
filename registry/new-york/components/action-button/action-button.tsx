'use client'
import React, { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion, Variants } from 'framer-motion'

import {
    ACTION_BUTTON_POPUP_BACKDROP_VARIANTS,
    ACTION_BUTTON_POPUP_VARIANTS,
} from '@/registry/new-york/lib/constants'
import { Button } from '@/shadcn/components/ui/button'
import { cn } from '@/shadcn/lib/utils'

const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    popupContent,
    className,
    variant = 'default',
    size = 'default',
    disabled = false,
    onClick,
    ...props
}) => {
    const [clickedPosition, setClickedPosition] = useState<{
        x: number
        y: number
    } | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [centerPosition, setCenterPosition] = useState<{
        x: number
        y: number
    } | null>(null)

    const buttonRef = useRef<HTMLButtonElement>(null)

    // Calculate center of viewport
    useEffect(() => {
        const calculateCenter = () => {
            setCenterPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            })
        }

        calculateCenter()
        window.addEventListener('resize', calculateCenter)

        return () => window.removeEventListener('resize', calculateCenter)
    }, [])

    // Calculate animation variants with dynamic positioning
    const getAnimationVariants = (): Variants => {
        if (!clickedPosition || !centerPosition)
            return ACTION_BUTTON_POPUP_VARIANTS as Variants

        const deltaX = centerPosition.x - clickedPosition.x - 100
        const deltaY = centerPosition.y - clickedPosition.y - 100

        return {
            initial: {
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0,
            },
            animate: {
                scale: 1,
                opacity: 1,
                x: deltaX,
                y: deltaY,
                transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    duration: 0.3,
                },
            },
            exit: {
                scale: 0,
                opacity: 0,
                x: 0,
                y: 0,
                transition: {
                    duration: 0.3,
                    ease: 'easeInOut',
                },
            },
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return

        const rect = e.currentTarget.getBoundingClientRect()
        setClickedPosition({
            x: rect.left,
            y: rect.top,
        })
        setIsOpen(true)
        onClick?.()
    }

    const closePopup = () => {
        setIsOpen(false)
        // Delay clearing position to allow exit animation
        setTimeout(() => setClickedPosition(null), 200)
    }

    return (
        <>
            <Button
                ref={buttonRef}
                className={cn(className)}
                variant={variant}
                size={size}
                disabled={disabled}
                onClick={handleClick}
                {...props}
            >
                {children}
            </Button>

            <AnimatePresence>
                {isOpen && clickedPosition && (
                    <>
                        <motion.div
                            variants={ACTION_BUTTON_POPUP_BACKDROP_VARIANTS}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]'
                            onClick={closePopup}
                        />

                        <motion.div
                            variants={getAnimationVariants()}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            style={{
                                position: 'fixed',
                                left: clickedPosition.x,
                                top: clickedPosition.y,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1000,
                            }}
                            className='pointer-events-auto'
                        >
                            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm'>
                                {popupContent}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

interface ActionButtonProps extends React.ComponentProps<'button'> {
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
    onClick?: () => void
}

export default ActionButton
