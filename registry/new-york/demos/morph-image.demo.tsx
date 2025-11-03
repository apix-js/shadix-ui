"use client";
import type React from "react";

import MorphImage from "@/registry/new-york/components/morph-image";

const MorphImageDemo: React.FC = () => {
    return (
        <MorphImage
            src="/images/card-1.jpg"
            alt="Morph Image"
            className="w-[300px]"
        />
    );
};

export default MorphImageDemo;
