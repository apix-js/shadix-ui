"use client";
import type React from "react";

import {
    ImageGallery,
    type ImageItem,
} from "@/registry/new-york/components/image-gallery";

const images: ImageItem[] = [
    {
        src: "https://picsum.photos/id/1014/800/600",
        alt: "Image 1",
    },
    {
        src: "https://picsum.photos/id/1022/800/600",
        alt: "Image 2",
    },
    {
        src: "https://picsum.photos/id/768/800/600",
        alt: "Image 3",
    },
    {
        src: "https://picsum.photos/id/650/800/600",
        alt: "Image 4",
    },
    {
        src: "https://picsum.photos/id/600/800/600",
        alt: "Image 5",
    },
    {
        src: "https://picsum.photos/id/652/800/600",
        alt: "Image 6",
    },
    {
        src: "https://picsum.photos/id/960/800/600",
        alt: "Image 7",
    },
    {
        src: "https://picsum.photos/id/25/800/600",
        alt: "Image 8",
    },
];

const ImageGalleryDemo: React.FC = () => {
    return (
        <div className="w-full p-4 md:p-8 max-w-[600px]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                    Responsive Image Gallery
                </h2>
                <p className="text-muted-foreground">
                    Resize your browser to see the responsive columns (1 on
                    mobile, 2 on tablet, 3 on desktop)
                </p>
            </div>

            <ImageGallery
                images={images}
                gap={16}
                lazyLoading={true}
                columns={{
                    desktop: 3,
                }}
                className="w-full"
            />
        </div>
    );
};

export default ImageGalleryDemo;
