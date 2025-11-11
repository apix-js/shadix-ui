"use client";
import type React from "react";

import "@/registry/new-york/styles/video-player.css";

import { VideoPlayerBuffer } from "@/registry/new-york/components/video-player/video-player-buffer";
import { VideoPlayerControls } from "@/registry/new-york/components/video-player/video-player-controls";
import { VideoPlayerIndicator } from "@/registry/new-york/components/video-player/video-player-indicator";
import { VideoPlayerProgressBar } from "@/registry/new-york/components/video-player/video-player-progress-bar";
import { useVideoPlayer } from "@/registry/new-york/hooks/useVideoPlayer";

export interface VideoPlayerProps {
    /** @public (required) Source of the video */
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
    /** @public (optional) Whether to autoplay the video */
    autoPlay?: boolean;
    /** @public (optional) Thumbnail image for the video */
    thumbnail?: string;
    /** @public (optional) Time at which to display the thumbnail */
    thumbnailTime?: number;
    /** @public (optional) Subtitles for the video */
    subtitles?: {
        src: string;
        lang: string;
        label: string;
    }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    subtitles,
    src,
    autoPlay = false,
    thumbnail,
    thumbnailTime,
}) => {
    const {
        playerRef,
        containerRef,
        playing,
        indicator,
        isBuffering,
        volume,
        muted,
        progress,
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
    } = useVideoPlayer({
        src,
        autoPlay,
        thumbnail,
        thumbnailTime,
    });

    return (
        <div className="w-full max-w-2xl mx-auto overflow-hidden">
            <div ref={containerRef} className="relative">
                <video
                    ref={playerRef}
                    src={src as string}
                    className="w-full min-h-72 bg-muted aspect-video"
                    controls={false}
                    poster={displayThumb || undefined}
                    crossOrigin="anonymous"
                    onTimeUpdate={handleProgress}
                    onLoadedMetadata={handleProgress}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onClick={handlePlayPause}
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}
                    onCanPlayThrough={handleCanPlay}
                    muted={muted}
                >
                    <track kind="captions" srcLang="en" label="English" />
                    {subtitles?.map((sub) => (
                        <track
                            key={`${sub.src}-${sub.lang}`}
                            src={sub.src}
                            kind="captions"
                            label={sub.label}
                            srcLang={sub.lang}
                        />
                    ))}
                </video>

                <VideoPlayerBuffer isBuffering={isBuffering} />

                <VideoPlayerIndicator indicator={indicator} playing={playing} />

                <VideoPlayerProgressBar
                    progress={progress}
                    loadedProgress={loadedProgress}
                    playerRef={playerRef as React.RefObject<HTMLVideoElement>}
                    duration={playerRef.current?.duration || 0}
                    onSeek={seek}
                />

                <VideoPlayerControls
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={toggleFullscreen}
                    onPlayPause={handlePlayPause}
                    onVolumeChange={handleVolumeChange}
                    onMuteToggle={() => setMuted(!muted)}
                />
            </div>
        </div>
    );
};

export { VideoPlayer };
