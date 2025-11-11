"use client";
import type React from "react";

import {
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    Volume1,
    Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type IndicatorType =
    | "play"
    | "pause"
    | "volume-up"
    | "volume-down"
    | "seek-forward"
    | "seek-backward"
    | null;

interface VideoPlayerIndicatorProps {
    indicator: IndicatorType;
    playing: boolean;
}

export const VideoPlayerIndicator: React.FC<VideoPlayerIndicatorProps> = ({
    indicator,
    playing,
}) => {
    return (
        <AnimatePresence>
            {indicator === "play" || indicator === "pause" ? (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-accent/50 rounded-full p-4">
                        {playing ? (
                            <Play className="size-12 text-white " />
                        ) : (
                            <Pause className="size-12 text-white " />
                        )}
                    </div>
                </motion.div>
            ) : indicator === "volume-down" || indicator === "volume-up" ? (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-accent/50 rounded-full p-4">
                        {indicator === "volume-down" ? (
                            <Volume1 className="size-12 text-white " />
                        ) : (
                            <Volume2 className="size-12 text-white " />
                        )}
                    </div>
                </motion.div>
            ) : indicator === "seek-forward" ? (
                <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
                    <motion.div
                        className="flex items-center gap-0"
                        initial={{
                            opacity: 0,
                            x: -10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >
                        <span className="text-lg font-medium">+5</span>
                        <ChevronRight className="size-10 text-white" />
                    </motion.div>
                </div>
            ) : indicator === "seek-backward" ? (
                <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
                    <motion.div
                        className="flex items-center gap-0"
                        initial={{
                            opacity: 0,
                            x: 10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                    >
                        <ChevronLeft className="size-10 text-white" />
                        <span className="text-lg font-medium">+5</span>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
};
