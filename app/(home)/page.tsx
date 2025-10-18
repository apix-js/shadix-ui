"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import {
    ArrowRightIcon,
    CodeIcon,
    ExternalLinkIcon,
    GithubIcon,
    PaletteIcon,
    SparklesIcon,
    ZapIcon,
} from "lucide-react";
import Link from "next/link";

import ActionButton from "@/registry/new-york/components/action-button";
import {
    MotionDialog,
    MotionDialogContent,
    MotionDialogDescription,
    MotionDialogHeader,
    MotionDialogTitle,
    MotionDialogTrigger,
} from "@/registry/new-york/components/motion-dialog";
import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/ui/card";
import { Separator } from "@/shadcn/components/ui/separator";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-pattern bg-pattern-overlay">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="mb-8">
                        <Badge
                            variant="secondary"
                            className="mb-4 px-4 py-2 text-sm"
                        >
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Custom shadcn/ui Registry
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
                            Shadix UI
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            Beautiful, accessible, and customizable React
                            components built on top of shadcn/ui. Enhanced with
                            modern animations and advanced interactions.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="text-lg px-8 py-6" asChild>
                            <Link href="/docs">
                                Get Started
                                <ArrowRightIcon className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6"
                            asChild
                        >
                            <Link
                                href="https://github.com/apix-js/shadix-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GithubIcon className="mr-2 w-5 h-5" />
                                View on GitHub
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose Shadix UI?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Built with modern web standards and enhanced with
                        beautiful animations
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <ZapIcon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Modern Animations</CardTitle>
                                <CardDescription>
                                    Smooth, performant animations powered by
                                    Framer Motion for delightful user
                                    experiences.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <PaletteIcon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Customizable</CardTitle>
                                <CardDescription>
                                    Fully customizable components that adapt to
                                    your design system and brand identity.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <CodeIcon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Developer Friendly</CardTitle>
                                <CardDescription>
                                    Built with TypeScript, fully typed, and easy
                                    to integrate into your existing projects.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Component Showcase */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Component Showcase
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        See our custom components in action
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Action Button Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Action Button</CardTitle>
                                <CardDescription>
                                    A button that displays a confirmation popup
                                    when clicked, perfect for destructive
                                    actions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <ActionButton
                                        variant="destructive"
                                        onConfirm={async () => {
                                            await new Promise((resolve) =>
                                                setTimeout(resolve, 1000),
                                            );
                                            return {
                                                message:
                                                    "Item deleted successfully!",
                                            };
                                        }}
                                        title="Delete Item"
                                        popupContent={
                                            <p>
                                                Are you sure you want to delete
                                                this item? This action cannot be
                                                undone.
                                            </p>
                                        }
                                    >
                                        Delete Item
                                    </ActionButton>
                                    <ActionButton
                                        variant="default"
                                        onConfirm={async () => {
                                            await new Promise((resolve) =>
                                                setTimeout(resolve, 1000),
                                            );
                                            return {
                                                message: "Action completed!",
                                            };
                                        }}
                                        title="Confirm Action"
                                        popupContent={
                                            <p>
                                                This will perform the requested
                                                action. Do you want to continue?
                                            </p>
                                        }
                                    >
                                        Confirm Action
                                    </ActionButton>
                                </div>
                                <Separator />
                                <div className="text-sm text-muted-foreground">
                                    <strong>Features:</strong> Loading states,
                                    toast notifications, customizable content
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Motion Dialog Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Motion Dialog</CardTitle>
                                <CardDescription>
                                    A dialog component with beautiful motion
                                    animations and multiple animation variants.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <MotionDialog animation="ripple">
                                        <MotionDialogTrigger asChild>
                                            <Button variant="outline">
                                                Ripple Animation
                                            </Button>
                                        </MotionDialogTrigger>
                                        <MotionDialogContent>
                                            <MotionDialogHeader>
                                                <MotionDialogTitle>
                                                    Ripple Animation
                                                </MotionDialogTitle>
                                                <MotionDialogDescription>
                                                    This dialog uses a ripple
                                                    animation effect. Try
                                                    different variants!
                                                </MotionDialogDescription>
                                            </MotionDialogHeader>
                                        </MotionDialogContent>
                                    </MotionDialog>

                                    <MotionDialog animation="zoom">
                                        <MotionDialogTrigger asChild>
                                            <Button variant="outline">
                                                Zoom Animation
                                            </Button>
                                        </MotionDialogTrigger>
                                        <MotionDialogContent>
                                            <MotionDialogHeader>
                                                <MotionDialogTitle>
                                                    Zoom Animation
                                                </MotionDialogTitle>
                                                <MotionDialogDescription>
                                                    This dialog uses a zoom
                                                    animation effect for a
                                                    smooth entrance.
                                                </MotionDialogDescription>
                                            </MotionDialogHeader>
                                        </MotionDialogContent>
                                    </MotionDialog>
                                </div>
                                <Separator />
                                <div className="text-sm text-muted-foreground">
                                    <strong>Features:</strong> Multiple
                                    animation variants, smooth transitions,
                                    accessible
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="pt-8 pb-8">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Explore our documentation and start building
                                beautiful interfaces today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6"
                                    asChild
                                >
                                    <Link href="/docs">
                                        View Documentation
                                        <ExternalLinkIcon className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>
        </div>
    );
}
