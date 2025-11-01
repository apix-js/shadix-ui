"use client";
import type React from "react";

import { Loader } from "@/registry/new-york/components/loader";

const LoaderDemo: React.FC<LoaderDemoProps> = () => {
    return (
        <div className="flex gap-10 flex-wrap max-w-md items-center">
            <Loader variant="arc" size={"md"} />
            <Loader variant="dual-arc" size={"md"} />
            <Loader variant="bar" size={"md"} />
            <Loader variant="beat" size={"md"} />
            <Loader variant="bounce" size={"md"} />
            <Loader variant="circle-dots" size={"md"} />
            <Loader variant="clip" size={"md"} />
            <Loader variant="puff" size={"md"} />
            <Loader variant="three-dots" size={"md"} />
            <Loader variant="triangle" size={"md"} />
            <Loader variant="two-dots" size={"md"} />
        </div>
    );
};

interface LoaderDemoProps {
    [key: string]: unknown;
}

export default LoaderDemo;
