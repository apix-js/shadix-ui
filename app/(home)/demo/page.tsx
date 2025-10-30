"use client";

import { notFound } from "next/navigation";

import ReorderListDemo from "@/registry/new-york/demos/reorder-list.demo";
// import SignaturePadDemo from "@/registry/new-york/demos/signature-pad.demo";

// import ExpandableCardDemo from "@/registry/new-york/demos/expandable-card.demo";

// feat: Create demo component showcasing all animation variants
export default function AnimatedDialogDemo() {
    if (process.env.NODE_ENV === "production") {
        notFound();
    }

    return (
        <div className="mt-10 flex items-center justify-center h-auto">
            {/* <DateTimePickerDemo /> */}
            {/* <ExpandableCardDemo /> */}
            {/* <SignaturePadDemo /> */}
            <ReorderListDemo />
        </div>
    );
}
