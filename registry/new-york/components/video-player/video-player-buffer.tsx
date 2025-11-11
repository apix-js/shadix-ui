"use client";

import { AnimatePresence, motion } from "motion/react";

interface VideoPlayerBufferProps {
    isBuffering: boolean;
}

export const VideoPlayerBuffer: React.FC<VideoPlayerBufferProps> = ({
    isBuffering,
}) => {
    return (
        <AnimatePresence>
            {isBuffering && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="relative">
                        <motion.div
                            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
