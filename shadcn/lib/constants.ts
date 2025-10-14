export const ACTION_BUTTON_POPUP_VARIANTS = {
    initial: {
        scale: 0,
        opacity: 0,
        originX: 0.5,
        originY: 0.5,
    },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
}

export const ACTION_BUTTON_POPUP_BACKDROP_VARIANTS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
}
