"use client";

import type React from "react";

import { usePathname } from "next/navigation";

// import { source } from "@/lib/source";

const Sidebar: React.FC = () => {
    const pathname = usePathname();

    // console.log(source.pageTree);

    return (
        <aside className="fixed left-0 rtl:left-auto rtl:right-(--removed-body-scroll-bar-size,0) flex flex-col items-end top-(--fd-sidebar-top) bottom-(--fd-sidebar-margin) z-20 bg-fd-card text-sm border-e transition-[top,opacity,translate,width] duration-200 max-md:hidden *:w-(--fd-sidebar-width)"></aside>
    );
};

export default Sidebar;
