import type React from "react";

import {
    SegmentLayout,
    SegmentLayoutContent,
} from "@/registry/new-york/components/segment-layout";

const SegmentLayoutDemo: React.FC = () => {
    return (
        <div className="w-full">
            <SegmentLayout
                leftItems={[
                    {
                        label: "Back-End Developer ",
                        value: "back-end-developer",
                    },
                    {
                        label: "Front-End Developer",
                        value: "front-end-developer",
                    },
                    {
                        label: "Full-Stack Developer ",
                        value: "full-stack-developer",
                    },
                    {
                        label: "DevOps Engineer",
                        value: "devops-engineer",
                        disabled: true,
                    },
                ]}
                classNames={{
                    mainWrapper: "sm:p-0",
                    contentWrapper: "min-w-80",
                    itemsWrapper: "w-50",
                }}
                rightItems={[
                    {
                        label: "System Administrator",
                        value: "system-administrator",
                        disabled: true,
                    },
                    {
                        label: "Database Administrator",
                        value: "database-administrator",
                    },
                    {
                        label: "Network Administrator",
                        value: "network-administrator",
                    },
                    {
                        label: "Security Analyst",
                        value: "security-analyst",
                    },
                ]}
            >
                <SegmentLayoutContent
                    value="back-end-developer"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Back-End Developer
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="front-end-developer"
                    className="flex w-full h-40"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Front-End Developer
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="full-stack-developer"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Full-Stack Developer
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="devops-engineer"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        DevOps Engineer
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="system-administrator"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        System Administrator
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="database-administrator"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Database Administrator
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="network-administrator"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Network Administrator
                    </h2>
                </SegmentLayoutContent>
                <SegmentLayoutContent
                    value="security-analyst"
                    className="flex w-full h-80"
                >
                    <h2 className="text-2xl !m-0 !p-0 font-semibold">
                        Security Analyst
                    </h2>
                </SegmentLayoutContent>
            </SegmentLayout>
        </div>
    );
};

export default SegmentLayoutDemo;
