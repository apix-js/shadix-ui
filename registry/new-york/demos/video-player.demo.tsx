"use client";
import type React from "react";

import { VideoPlayer } from "@/registry/new-york/components/video-player/video-player";

const VideoPlayerDemo: React.FC = () => {
    return (
        <VideoPlayer src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    );
};

export default VideoPlayerDemo;
