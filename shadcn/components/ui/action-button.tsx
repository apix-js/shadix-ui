'use client'

import React, { useRef, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/shadcn/components/ui/button'
import { ACTION_BUTTON_POPUP_BACKDROP_VARIANTS } from '@/shadcn/lib/constants'
import { cn } from '@/shadcn/lib/utils'

/**
 * `ActionButton` is a button component that displays a popup when clicked.
 *
 * @component
 * @param {object}   props
 * @param {React.ReactNode} props.children       - The content to render inside the button.
 * @param {React.ReactNode} props.popupContent   - The content to display in the popup.
 * @param {string} [props.className]             - Additional CSS class names for the button.
 * @param {'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'} [props.variant='default'] - Button variant.
 * @param {'default'|'sm'|'lg'|'icon'|'icon-sm'|'icon-lg'} [props.size='default']                  - Button size.
 * @param {boolean} [props.disabled=false]       - Disable the button if true.
 * @param {() => void} [props.onClick]           - Optional onClick handler.
 * @param {any} [props.props]                    - Additional props passed down to the button.
 *
 * @example
 * <ActionButton
 *   variant="outline"
 *   popupContent={<span>Hello from popup!</span>}
 * >
 *   Click Me
 * </ActionButton>
 *
 * The popup is positioned relative to the center of the button, and clicking outside the popup closes it.
 */

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
    const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return

        const rect = e.currentTarget.getBoundingClientRect()
        setClickedPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
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
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]"
                            onClick={closePopup}
                        />

                        <motion.div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
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
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
    disabled?: boolean
    onClick?: () => void
}

export default ActionButton
