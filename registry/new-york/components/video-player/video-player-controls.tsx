"use client";

import type React from "react";

import {
    Maximize,
    Minimize,
    Pause,
    Play,
    Volume1,
    Volume2,
    VolumeOff,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shadcn/components/ui/button";
import { Slider } from "@/shadcn/components/ui/slider";

const MotionButton = motion.create(Button);

interface VideoPlayerControlsProps {
    playing: boolean;
    volume: number;
    muted: boolean;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onPlayPause: () => void;
    onVolumeChange: (value: number[]) => void;
    onMuteToggle: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
    playing,
    volume,
    muted,
    isFullscreen,
    toggleFullscreen,
    onPlayPause,
    onVolumeChange,
    onMuteToggle,
}) => {
    return (
        <div className="absolute bottom-2 flex items-center gap-4 justify-between w-full px-3">
            {/* Left Controls */}
            <div className="flex items-center justify-start gap-2">
                {/* Play Button */}
                <MotionButton
                    variant="ghost"
                    className="rounded-full !bg-accent/60 hover:!bg-accent/70 transition-all duration-300 ease-in"
                    size={"icon-lg"}
                    whileTap={{
                        scale: 0.9,
                    }}
                    transition={{
                        duration: 0.01,
                        ease: "linear",
                    }}
                    onClick={onPlayPause}
                >
                    {playing ? (
                        <Pause className="size-5" />
                    ) : (
                        <Play className="size-5" />
                    )}
                </MotionButton>

                {/* Volume Slider */}
                <motion.div
                    className="relative bg-accent/60 hover:bg-accent/70 transition-all duration-300 ease-in rounded-full overflow-hidden hover:pr-2"
                    whileHover={{
                        width: "120px",
                    }}
                    transition={{
                        ease: "linear",
                        duration: 0.1,
                    }}
                >
                    {muted || volume < 0.01 ? (
                        <Button
                            variant="ghost"
                            className="rounded-full hover:!bg-transparent"
                            size={"icon-sm"}
                            onClick={onMuteToggle}
                        >
                            <VolumeOff className="size-5" />
                        </Button>
                    ) : volume < 0.5 ? (
                        <Button
                            variant="ghost"
                            className="rounded-full hover:!bg-transparent"
                            size={"icon-sm"}
                            onClick={onMuteToggle}
                        >
                            <Volume1 className="size-5" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className="rounded-full hover:!bg-transparent"
                            size={"icon-sm"}
                            onClick={onMuteToggle}
                        >
                            <Volume2 className="size-5" />
                        </Button>
                    )}

                    <div className="absolute left-10 w-19 top-0 bottom-0 my-auto flex items-center pr-2">
                        <Slider
                            value={[volume * 100]}
                            onValueChange={onVolumeChange}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full h-1 volume-slider"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
                <MotionButton
                    variant="ghost"
                    className="rounded-full !bg-accent/60 hover:!bg-accent/70 transition-all duration-300 ease-in"
                    size={"icon-sm"}
                    whileTap={{
                        scale: 0.9,
                    }}
                    transition={{
                        duration: 0.01,
                        ease: "linear",
                    }}
                    onClick={toggleFullscreen}
                    aria-label={
                        isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                >
                    {isFullscreen ? (
                        <Minimize className="size-5" />
                    ) : (
                        <Maximize className="size-5" />
                    )}
                </MotionButton>
            </div>
        </div>
    );
};
