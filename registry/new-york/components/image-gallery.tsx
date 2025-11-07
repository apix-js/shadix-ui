"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

import MorphImage from "@/registry/new-york/components/morph-image";
import { useMasonry } from "@/registry/new-york/hooks/useMasonry";
import { useWindowSize } from "@/registry/new-york/hooks/useWindowSize";
import { cn } from "@/shadcn/lib/utils";

export interface ImageGalleryProps {
    /** @public (required) - Array of images to display in the gallery */
    images: ImageItem[];
    /** @public (optional) - Space between images in pixels (default: 16) */
    gap?: number;
    /** @public (optional) - Columns to display in each screen size */
    columns?: {
        desktop?: number;
        tablet?: number;
        mobile?: number;
    };
    /** @public (optional) - Enable laxy loading of images (default: true) */
    lazyLoading?: boolean;
    /** @public (optional) - class name for the container */
    className?: string;
    /** @public (optional) - Callback when an image is clicked */
    onImageClick?: (image: ImageItem, index: number) => void;
    /** @public (optional) - Callback to filter images before rendering */
    filterImages?: (images: ImageItem, index: number) => boolean;
    /** @public (optional) - Callback sort images */
    sortImages?: (a: ImageItem, b: ImageItem) => number;
}

export interface ImageItem {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

const observerOptions = {
    root: null,
    rootMargin: "500px",
    threshold: 0.01,
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    gap = 16,
    columns = {
        desktop: 3,
        tablet: 2,
        mobile: 1,
    },
    lazyLoading = true,
    className,
    onImageClick,
    filterImages,
    sortImages,
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const containerRef = useRef<HTMLDivElement>(null);

    const windowSize = useWindowSize();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Set initial width - use a small delay to ensure layout is complete
        const timer = setTimeout(() => {
            setContainerWidth(container.clientWidth);
        }, 100);

        // Create ResizeObserver to track container size changes
        const resizeObserver = new ResizeObserver(() => {
            setContainerWidth(container.clientWidth);
        });

        resizeObserver.observe(container);

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, []);

    const noOfColumns = useMemo(() => {
        if (windowSize.width < 768) return columns.mobile || 1;
        if (windowSize.width < 1024) return columns.tablet || 2;
        return columns.desktop as number;
    }, [windowSize.width, columns.mobile, columns.tablet, columns.desktop]);

    // Randomize dimensions for images that don't have them
    const getRandomDimensions = useCallback(() => {
        const aspectRatios = [0.75, 1, 1.5, 2];
        const randomAspectRatio =
            aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const baseWidth = 600;
        const width = baseWidth + Math.floor(Math.random() * 400);
        const height = Math.round(width / randomAspectRatio);
        return { width, height };
    }, []);

    const processedImages = useMemo(() => {
        let result = [...images];

        // Add random dimensions to images that don't have them
        result = result.map((image) => {
            if (!image.width || !image.height) {
                return {
                    ...image,
                    ...getRandomDimensions(),
                };
            }
            return image;
        });

        if (filterImages) {
            result = result.filter((image, index) =>
                filterImages(image, index),
            );
        }

        if (sortImages) {
            result = result.sort((a, b) => sortImages(a, b));
        }

        return result;
    }, [images, filterImages, sortImages, getRandomDimensions]);

    const { layout, totalHeight } = useMasonry(
        processedImages,
        containerWidth,
        {
            gap,
            columns: noOfColumns as number,
        },
    );

    // Load initially visible images + those within buffer to prevent blinking
    useEffect(() => {
        if (layout.length === 0) return;

        let observer: IntersectionObserver | null = null;

        // Use requestAnimationFrame to ensure DOM is rendered before observing
        const rafId = requestAnimationFrame(() => {
            const imageElements =
                containerRef.current?.querySelectorAll("[data-src]");

            // Preload initially visible images + buffer area
            const imagesToLoad = new Set<string>();
            imageElements?.forEach((el) => {
                const src = (el as HTMLElement).dataset.src;
                if (src) {
                    const rect = el.getBoundingClientRect();
                    // Preload images within large buffer to prevent blinking
                    if (
                        rect.top < window.innerHeight + 500 &&
                        rect.bottom > -500
                    ) {
                        imagesToLoad.add(src);
                    }
                }
            });

            if (imagesToLoad.size > 0) {
                setLoadedImages((prev) => {
                    const newSet = new Set(prev);
                    imagesToLoad.forEach((src) => {
                        newSet.add(src);
                    });
                    return newSet;
                });
            }

            // Setup observer for lazy loading remaining images
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const src = (entry.target as HTMLElement).dataset.src;

                        if (src) {
                            // Mark image as loaded when entering viewport
                            setLoadedImages((prev) => {
                                const newSet = new Set(prev);
                                newSet.add(src);
                                return newSet;
                            });
                            if (observer) {
                                observer.unobserve(entry.target);
                            }
                        }
                    }
                });
            }, observerOptions);

            imageElements?.forEach((el) => {
                if (observer) {
                    observer.observe(el);
                }
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            if (observer) {
                observer.disconnect();
            }
        };
    }, [layout.length]);

    const handleImageClick = useCallback(
        (image: ImageItem, index: number) => {
            onImageClick?.(image, index);
        },
        [onImageClick],
    );

    return (
        <div
            ref={containerRef}
            className={cn("w-full relative", className)}
            style={{
                height: `${totalHeight}px`,
            }}
        >
            {layout.map((item, index) => {
                const shouldLoadImage =
                    !lazyLoading || loadedImages.has(item.src);

                return (
                    <div
                        key={`${item.src}-${index}`}
                        data-src={item.src}
                        className={cn(
                            "rounded-lg",
                            lazyLoading &&
                                !shouldLoadImage &&
                                "bg-muted-foreground/10 animate-pulse",
                        )}
                        style={{
                            position: "absolute",
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            width: `${item.displayWidth}px`,
                            height: `${item.displayHeight}px`,
                            overflow: "hidden",
                        }}
                    >
                        {shouldLoadImage ? (
                            <MorphImage
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full"
                                layoutId={`image-gallery-${index}`}
                                onClick={() => handleImageClick(item, index)}
                            />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

export { ImageGallery };
