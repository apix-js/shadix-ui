"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

import { motion } from "motion/react";

interface VideoPlayerProgressBarProps {
    progress: number;
    loadedProgress: number;
    playerRef: React.RefObject<HTMLVideoElement>;
    duration: number;
    onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const THROTTLE_DELAY = 200;
const MAX_CACHE_SIZE = 50;

export const VideoPlayerProgressBar: React.FC<VideoPlayerProgressBarProps> = ({
    progress,
    loadedProgress,
    playerRef,
    duration,
    onSeek,
}) => {
    const [hoverTime, setHoverTime] = useState<number>(0);
    const [hoverPosition, setHoverPosition] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [_isHovering, setIsHovering] = useState<boolean>(false);

    const leaveTimeoutRef = useRef<NodeJS.Timeout>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const thumbCache = useRef<Map<number, HTMLCanvasElement>>(new Map());
    const lastCaptureTime = useRef<number>(0);

    const initializePreviewVideo = useCallback(() => {
        if (isInitialized || !playerRef.current) return;

        const mainVideo = playerRef.current;
        const clonedVideo = mainVideo.cloneNode(true) as HTMLVideoElement;
        clonedVideo.muted = true;
        clonedVideo.playsInline = true;
        clonedVideo.style.cssText =
            "display:none;position:absolute;width:1px;height:1px;opacity:0;pointer-events:none";

        if (mainVideo.parentElement) {
            mainVideo.parentElement.appendChild(clonedVideo);
        }

        previewVideoRef.current = clonedVideo;
        setIsInitialized(true);
    }, [isInitialized, playerRef]);

    const addToCache = useCallback(
        (time: number, canvas: HTMLCanvasElement) => {
            if (thumbCache.current.size >= MAX_CACHE_SIZE) {
                const firstKey = thumbCache.current.keys().next().value;
                thumbCache.current.delete(firstKey as number);
            }

            thumbCache.current.set(time, canvas);
        },
        [],
    );

    const captureThumb = useCallback(
        (time: number) => {
            if (!previewVideoRef.current || !canvasRef.current) return;

            const video = previewVideoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            const roundedTime = Math.floor(time);

            // Check if thumbnail is already cached
            if (thumbCache.current.has(roundedTime)) {
                const cachedCanvas = thumbCache.current.get(roundedTime);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(cachedCanvas as CanvasImageSource, 0, 0);
                setIsCapturing(false);
                return;
            }

            setIsCapturing(true);
            video.currentTime = time;

            const handleSeeked = () => {
                requestAnimationFrame(() => {
                    // Use smaller resolution for preview (faster rendering)
                    const previewWidth = 160;
                    const previewHeight = 90;

                    canvas.width = previewWidth;
                    canvas.height = previewHeight;

                    // Draw scaled down for better performance
                    ctx.drawImage(video, 0, 0, previewWidth, previewHeight);

                    // Cache the canvas
                    const cachedCanvas = document.createElement("canvas");
                    cachedCanvas.width = previewWidth;
                    cachedCanvas.height = previewHeight;
                    const cachedCtx = cachedCanvas.getContext("2d");
                    if (cachedCtx) {
                        cachedCtx.drawImage(canvas, 0, 0);
                        addToCache(roundedTime, cachedCanvas);
                    }

                    video.removeEventListener("seeked", handleSeeked);
                    setIsCapturing(false);
                });
            };

            video.addEventListener("seeked", handleSeeked);
        },
        [addToCache],
    );

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        // Clear any pending hide timeout
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }

        if (!playerRef.current || !duration || !Number.isFinite(duration))
            return;

        setIsHovering(true);

        const now = Date.now();
        if (now - lastCaptureTime.current < THROTTLE_DELAY) return;
        lastCaptureTime.current = now;

        if (!isInitialized) {
            initializePreviewVideo();
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const time = percentage * duration;
        const position = e.clientX - rect.left;

        if (!Number.isFinite(time) || time < 0) return;

        setHoverTime(time);
        setHoverPosition(position);

        // Capture thumbnail at this time
        captureThumb(time);
    };

    const handleProgressLeave = () => {
        // Clear any existing timeout
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
        }

        // Delay hiding to allow moving to preview thumbnail
        leaveTimeoutRef.current = setTimeout(() => {
            setHoverTime(0);
            setHoverPosition(0);
            setIsCapturing(false);
            setIsHovering(false);
            leaveTimeoutRef.current = null;
        }, 200); // 200ms delay
    };

    const handlePreviewEnter = () => {
        // Cancel hide when hovering over preview
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    };

    const handlePreviewLeave = () => {
        // Hide preview when leaving preview area
        setHoverTime(0);
        setIsHovering(false);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        return () => {
            if (previewVideoRef.current?.parentElement) {
                previewVideoRef.current.parentElement.removeChild(
                    previewVideoRef.current,
                );
                setIsInitialized(false);
            }
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            thumbCache.current.clear();
        };
    }, []);

    return (
        <div
            className="absolute bottom-14 left-0 w-full px-3 cursor-pointer"
            onClick={onSeek}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onSeek(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
            }}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
            role="button"
            tabIndex={0}
            aria-label="Video Progress Bar"
        >
            <div className="relative w-full h-1 bg-accent/60 hover:h-2 transition-all duration-300 ease-in">
                {hoverTime !== 0 && (
                    <motion.div
                        layout
                        transition={{
                            ease: "linear",
                        }}
                        animate={{
                            left: `${hoverPosition}px`,
                            transform: `translateX(-50%)`,
                        }}
                        initial={false}
                        className="absolute bottom-full mb-2 pointer-events-none z-20"
                        style={{}}
                        onMouseEnter={handlePreviewEnter}
                        onMouseLeave={handlePreviewLeave}
                    >
                        <div className="bg-black rounded overflow-hidden shadow-lg">
                            <canvas
                                ref={canvasRef}
                                className="w-32 h-18 object-cover"
                                style={{
                                    display: isCapturing ? "none" : "block",
                                }}
                            />
                            {isCapturing && (
                                <div className="w-32 h-18 bg-gray-800 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                            <div className="px-2 py-1 text-white text-xs text-center bg-black/80">
                                {formatTime(hoverTime)}
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="absolute inset-0 bg-white/30 pointer-events-none"
                    animate={{
                        width: `${loadedProgress * 100}%`,
                    }}
                    initial={false}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        ease: [0.65, 0.815, 0.735, 0.395],
                    }}
                />

                <motion.div
                    className="relative h-full bg-primary pointer-events-none"
                    animate={{
                        width: `${progress * 100}%`,
                    }}
                    initial={false}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        ease: [0.65, 0.815, 0.735, 0.395],
                    }}
                    whileHover={{
                        height: ".5rem",
                    }}
                />
            </div>
        </div>
    );
};
