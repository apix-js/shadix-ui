"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

import { useEventListener } from "@/registry/new-york/hooks/useEventListener";

type IndicatorType =
    | "play"
    | "pause"
    | "volume-up"
    | "volume-down"
    | "seek-forward"
    | "seek-backward"
    | null;

interface UseVideoPlayerProps {
    src:
        | string
        | {
              "2160p"?: string;
              "1440p"?: string;
              "1080p"?: string;
              "720p"?: string;
              "480p"?: string;
              "360p"?: string;
              "240p"?: string;
          };
    autoPlay?: boolean;
    thumbnail?: string;
    thumbnailTime?: number;
}

export type UseVideoPlayerReturn = ReturnType<typeof useVideoPlayer>;

export const useVideoPlayer = ({
    src,
    autoPlay = false,
    thumbnail,
    thumbnailTime,
}: UseVideoPlayerProps) => {
    const [playing, setPlaying] = useState(autoPlay);
    const [indicator, setIndicator] = useState<IndicatorType>(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [capturedThumbnail, setCapturedThumbnail] = useState<string | null>(
        null,
    );
    const [loadedProgress, setLoadedProgress] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const playerRef = useRef<HTMLVideoElement>(null);
    const indicatorRef = useRef<NodeJS.Timeout>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const captureThumbnail = useCallback(
        (time: number = 0) => {
            const videoSrc =
                typeof src === "string"
                    ? src
                    : src["1080p"] ||
                      src["720p"] ||
                      src["480p"] ||
                      Object.values(src)[0];

            if (!videoSrc) {
                console.error("No valid video source found");
                return;
            }

            const previewVideo = document.createElement(
                "video",
            ) as HTMLVideoElement;

            previewVideo.crossOrigin = "anonymous";
            previewVideo.src = videoSrc;
            previewVideo.currentTime = time;

            const canvas = document.createElement("canvas");
            const ctx = canvas?.getContext("2d");
            if (!ctx) return;

            const handleSeeked = () => {
                requestAnimationFrame(() => {
                    canvas.width = previewVideo.videoWidth || 0;
                    canvas.height = previewVideo.videoHeight || 0;
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(previewVideo, 0, 0);

                    const imageData = canvas.toDataURL("image/png");
                    setCapturedThumbnail(imageData);

                    previewVideo.removeEventListener("seeked", handleSeeked);
                    previewVideo.removeEventListener("error", handleError);
                    previewVideo.src = "";
                });

                canvas.remove();
            };

            const handleError = () => {
                previewVideo.removeEventListener("seeked", handleSeeked);
                previewVideo.removeEventListener("error", handleError);
                console.error("Failed to load video for thumbnail capture");
            };

            previewVideo.addEventListener("seeked", handleSeeked);
            previewVideo.addEventListener("error", handleError);
        },
        [src],
    );

    const handleProgress = () => {
        if (!playerRef.current) return;
        const { currentTime: ct, duration: dur } =
            playerRef.current as HTMLVideoElement;

        setCurrentTime(ct);
        setDuration(dur);
        setProgress(dur ? ct / dur : 0);

        updateLoadedProgress();
    };

    const showIndicator = (type: IndicatorType) => {
        setIndicator(type);
        if (indicatorRef.current) clearTimeout(indicatorRef.current);
        indicatorRef.current = setTimeout(() => {
            setIndicator(null);
        }, 800);
    };

    const handleVolumeChange = (value: number[]) => {
        if (!playerRef.current) return;
        const newVolume = value[0] / 100;

        if (newVolume < 0.01) {
            setMuted(true);
        } else {
            setMuted(false);
        }

        showIndicator(
            newVolume >= volume && volume !== 0 ? "volume-up" : "volume-down",
        );
        setVolume(newVolume);
    };

    const handlePlayPause = () => {
        if (!playerRef.current) return;

        if (playerRef.current.paused) {
            playerRef.current.play();
            setPlaying(true);
        } else {
            playerRef.current.pause();
            setPlaying(false);
        }

        showIndicator(playing ? "pause" : "play");
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    const seek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!playerRef.current || !duration || !Number.isFinite(duration))
            return;

        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;

        // fix: Validate percentage is between 0 and 1
        const clampedPercentage = Math.max(0, Math.min(1, percentage));
        const seekTime = clampedPercentage * duration;

        // fix: Validate seekTime is finite before setting
        if (!Number.isFinite(seekTime) || seekTime < 0) return;

        setProgress(clampedPercentage);
        playerRef.current.currentTime = seekTime;
    };

    const updateLoadedProgress = () => {
        if (!playerRef.current) return;

        const video = playerRef.current;
        const buffered = video.buffered;

        if (buffered.length > 0 && duration > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1);
            const loaded = bufferedEnd / duration;
            setLoadedProgress(loaded);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" && playerRef.current) {
            e.preventDefault();
            handlePlayPause();
            return;
        }

        if (e.code === "ArrowRight" && playerRef.current) {
            e.preventDefault();
            playerRef.current.currentTime += 5;
            showIndicator("seek-forward");
            return;
        }

        if (e.code === "ArrowLeft" && playerRef.current) {
            e.preventDefault();
            playerRef.current.currentTime -= 5;
            showIndicator("seek-backward");
            return;
        }

        if (e.code === "ArrowUp" && playerRef.current) {
            e.preventDefault();
            const newVolume = Math.min(1, volume + 0.1);
            handleVolumeChange([newVolume * 100]);
            return;
        }

        if (e.code === "ArrowDown" && playerRef.current) {
            e.preventDefault();
            const newVolume = Math.max(0, volume - 0.1);
            handleVolumeChange([newVolume * 100]);
            return;
        }
    };

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (
                (
                    container as unknown as {
                        webkitRequestFullscreen?: () => void;
                    }
                ).webkitRequestFullscreen
            ) {
                // Safari
                (
                    container as unknown as {
                        webkitRequestFullscreen: () => void;
                    }
                ).webkitRequestFullscreen();
            } else if (
                (container as unknown as { mozRequestFullScreen?: () => void })
                    .mozRequestFullScreen
            ) {
                // Firefox
                (
                    container as unknown as { mozRequestFullScreen: () => void }
                ).mozRequestFullScreen();
            } else if (
                (container as unknown as { msRequestFullscreen?: () => void })
                    .msRequestFullscreen
            ) {
                // IE/Edge
                (
                    container as unknown as { msRequestFullscreen: () => void }
                ).msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (
                (document as unknown as { webkitExitFullscreen?: () => void })
                    .webkitExitFullscreen
            ) {
                (
                    document as unknown as { webkitExitFullscreen: () => void }
                ).webkitExitFullscreen();
            } else if (
                (document as unknown as { mozCancelFullScreen?: () => void })
                    .mozCancelFullScreen
            ) {
                (
                    document as unknown as { mozCancelFullScreen: () => void }
                ).mozCancelFullScreen();
            } else if (
                (document as unknown as { msExitFullscreen?: () => void })
                    .msExitFullscreen
            ) {
                (
                    document as unknown as { msExitFullscreen: () => void }
                ).msExitFullscreen();
            }
        }
    }, []);

    useEffect(() => {
        if (!thumbnail) {
            captureThumbnail(thumbnailTime ?? 10);
        }
    }, [thumbnail, thumbnailTime, captureThumbnail]);

    useEffect(() => {
        return () => {
            if (indicatorRef.current) {
                clearTimeout(indicatorRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.volume = volume;
        }
    }, [volume]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(
                !!(
                    document.fullscreenElement ||
                    (
                        document as unknown as {
                            webkitFullscreenElement?: Element;
                        }
                    ).webkitFullscreenElement ||
                    (document as unknown as { mozFullScreenElement?: Element })
                        .mozFullScreenElement ||
                    (document as unknown as { msFullscreenElement?: Element })
                        .msFullscreenElement
                ),
            );
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange,
        );
        document.addEventListener(
            "mozfullscreenchange",
            handleFullscreenChange,
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "mozfullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "MSFullscreenChange",
                handleFullscreenChange,
            );
        };
    }, []);

    useEventListener("keydown", handleKeyDown);

    const displayThumb = useMemo(
        () => thumbnail || capturedThumbnail,
        [thumbnail, capturedThumbnail],
    );

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    return {
        playerRef,
        containerRef,
        playing,
        indicator,
        isBuffering,
        volume,
        muted,
        progress,
        duration,
        currentTime,
        displayThumb,
        loadedProgress,
        isFullscreen,
        toggleFullscreen,
        handleProgress,
        handlePlay,
        handlePause,
        handlePlayPause,
        handleVolumeChange,
        handleWaiting,
        handleCanPlay,
        seek,
        setMuted,
        updateLoadedProgress,
    };
};
