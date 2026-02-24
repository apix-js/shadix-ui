"use client";

import type React from "react";

import {
    AnimatedTabs,
    AnimatedTabsContent,
    AnimatedTabsList,
    AnimatedTabsTrigger,
} from "@/registry/new-york/components/animated-tabs";

const AnimatedTabsDemo: React.FC<Record<string, never>> = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4 font-medium text-xl">Underline</h3>
                <AnimatedTabs
                    defaultValue="tab1"
                    indicator="underline"
                    contentAnimation="fade"
                >
                    <AnimatedTabsList>
                        <AnimatedTabsTrigger value="tab1">
                            Account
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab2">
                            Password
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab3">
                            Settings
                        </AnimatedTabsTrigger>
                    </AnimatedTabsList>
                    <AnimatedTabsContent value="tab1">
                        <p className="text-muted-foreground text-sm">
                            Account settings and profile.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab2">
                        <p className="text-muted-foreground text-sm">
                            Change your password here.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab3">
                        <p className="text-muted-foreground text-sm">
                            Manage app preferences.
                        </p>
                    </AnimatedTabsContent>
                </AnimatedTabs>
            </div>
            <div>
                <h3 className="mb-4 font-medium text-xl">Pill</h3>
                <AnimatedTabs
                    defaultValue="tab1"
                    indicator="pill"
                    contentAnimation="slide"
                >
                    <AnimatedTabsList>
                        <AnimatedTabsTrigger value="tab1">
                            Account
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab2">
                            Password
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab3">
                            Settings
                        </AnimatedTabsTrigger>
                    </AnimatedTabsList>
                    <AnimatedTabsContent value="tab1">
                        <p className="text-muted-foreground text-sm">
                            Account settings and profile.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab2">
                        <p className="text-muted-foreground text-sm">
                            Change your password here.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab3">
                        <p className="text-muted-foreground text-sm">
                            Manage app preferences.
                        </p>
                    </AnimatedTabsContent>
                </AnimatedTabs>
            </div>

            <div>
                <h3 className="mb-4 font-medium text-xl">Slide</h3>
                <AnimatedTabs
                    defaultValue="tab1"
                    indicator="slide"
                    contentAnimation="slideUp"
                >
                    <AnimatedTabsList>
                        <AnimatedTabsTrigger value="tab1">
                            Account
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab2">
                            Password
                        </AnimatedTabsTrigger>
                        <AnimatedTabsTrigger value="tab3">
                            Settings
                        </AnimatedTabsTrigger>
                    </AnimatedTabsList>
                    <AnimatedTabsContent value="tab1">
                        <p className="text-muted-foreground text-sm">
                            Account settings and profile.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab2">
                        <p className="text-muted-foreground text-sm">
                            Change your password here.
                        </p>
                    </AnimatedTabsContent>
                    <AnimatedTabsContent value="tab3">
                        <p className="text-muted-foreground text-sm">
                            Manage app preferences.
                        </p>
                    </AnimatedTabsContent>
                </AnimatedTabs>
            </div>
        </div>
    );
};

export default AnimatedTabsDemo;
