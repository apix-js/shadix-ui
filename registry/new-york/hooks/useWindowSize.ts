import { useState } from "react";

import { useEventListener } from "@/registry/new-york/hooks/useEventListener";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEventListener("resize", handleResize);

    return windowSize;
};

export { useWindowSize };
