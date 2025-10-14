export const ACTION_BUTTON_POPUP_VARIANTS = {
    initial: {
        scale: 0,
        opacity: 0,
        x: 0, // Start at button position
        y: 0, // Start at button position
    },
    animate: {
        scale: 1,
        opacity: 1,
        x: 0, // Will be calculated to move to center
        y: 0, // Will be calculated to move to center
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 25,
            duration: 0.6,
        },
    },
    exit: {
        scale: 0,
        opacity: 0,
        x: 0, // Return to button position
        y: 0, // Return to button position
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
}

export const ACTION_BUTTON_POPUP_BACKDROP_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}
