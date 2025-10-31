"use client";
import type React from "react";

import SignaturePad from "@/registry/new-york/components/signature-pad";

const SignaturePadDemo: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-4">
            <SignaturePad
                variant="default"
                size="md"
                onSave={(val) => console.log(val)}
                onChange={(val) => console.log(val)}
            />
        </div>
    );
};

export default SignaturePadDemo;
