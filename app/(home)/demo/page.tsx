'use client'

import * as React from 'react'
import { Button } from '@/shadcn/components/ui/button'
import { Sparkles, Zap, Heart, Star, Rocket, Gift, Crown } from 'lucide-react'
import {
    FancyPopup,
    FancyPopupClose,
    FancyPopupContent,
    FancyPopupDescription,
    FancyPopupFooter,
    FancyPopupHeader,
    FancyPopupTitle,
    FancyPopupTrigger,
} from '@/registry/new-york/components/fancy-popup'
import { AnimationVariant } from '@/registry/new-york/lib/popup-variants'

// feat: Create demo component showcasing all animation variants
export default function AnimatedDialogDemo() {
    const [selectedAnimation, setSelectedAnimation] =
        React.useState<AnimationVariant>('ripple')

    const animationVariants: Array<{
        variant: AnimationVariant
        label: string
        icon: React.ReactNode
        description: string
    }> = [
        {
            variant: 'ripple',
            label: 'Ripple',
            icon: <Sparkles className='h-6 w-6 text-blue-500' />,
            description: 'Smooth spring animation with natural bounce',
        },
        {
            variant: 'slide',
            label: 'Slide',
            icon: <Zap className='h-6 w-6 text-yellow-500' />,
            description: 'Slides in from top with spring physics',
        },
        {
            variant: 'flip',
            label: 'Flip',
            icon: <Heart className='h-6 w-6 text-red-500' />,
            description: '3D flip animation with depth',
        },
        {
            variant: 'blur',
            label: 'Blur',
            icon: <Star className='h-6 w-6 text-purple-500' />,
            description: 'Blur-to-focus transition effect',
        },
        {
            variant: 'elastic',
            label: 'Elastic',
            icon: <Rocket className='h-6 w-6 text-green-500' />,
            description: 'High-energy elastic spring animation',
        },
        {
            variant: 'pulse',
            label: 'Pulse',
            icon: <Gift className='h-6 w-6 text-pink-500' />,
            description: 'Pulsing scale animation with ease-out',
        },
        {
            variant: 'zoom',
            label: 'Zoom',
            icon: <Crown className='h-6 w-6 text-orange-500' />,
            description: 'Zoom in with rotation effect',
        },
    ]

    return (
        <div className='space-y-6'>
            {/* feat: Animation variant selector */}
            <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                    Choose Animation Variant:
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {animationVariants.map(
                        ({ variant, label, icon, description }) => (
                            <Button
                                key={variant}
                                variant={
                                    selectedAnimation === variant
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setSelectedAnimation(variant)}
                                className='h-auto p-4 flex flex-col items-center gap-2'
                            >
                                {icon}
                                <span className='text-sm font-medium'>
                                    {label}
                                </span>
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* feat: Demo dialog with selected animation */}
            <div className='flex justify-center'>
                <FancyPopup>
                    <FancyPopupTrigger asChild>
                        <Button variant='outline' size='lg'>
                            Open{' '}
                            {
                                animationVariants.find(
                                    (v) => v.variant === selectedAnimation
                                )?.label
                            }{' '}
                            Dialog
                        </Button>
                    </FancyPopupTrigger>
                    <FancyPopupContent
                        animation={selectedAnimation}
                        gradient='bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                        icon={
                            animationVariants.find(
                                (v) => v.variant === selectedAnimation
                            )?.icon
                        }
                        originX={0.5}
                        originY={0.5}
                        className='sm:max-w-[425px]'
                    >
                        <FancyPopupHeader animation={selectedAnimation}>
                            <FancyPopupTitle animation={selectedAnimation}>
                                {
                                    animationVariants.find(
                                        (v) => v.variant === selectedAnimation
                                    )?.label
                                }{' '}
                                Animation
                            </FancyPopupTitle>
                            <FancyPopupDescription
                                animation={selectedAnimation}
                            >
                                {
                                    animationVariants.find(
                                        (v) => v.variant === selectedAnimation
                                    )?.description
                                }
                            </FancyPopupDescription>
                        </FancyPopupHeader>

                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <div className='text-right text-sm font-medium'>
                                    Name
                                </div>
                                <input
                                    className='col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    defaultValue='John Doe'
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <div className='text-right text-sm font-medium'>
                                    Email
                                </div>
                                <input
                                    className='col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    defaultValue='john@example.com'
                                />
                            </div>
                        </div>

                        <FancyPopupFooter animation={selectedAnimation}>
                            <Button type='submit' className='w-full sm:w-auto'>
                                Save changes
                            </Button>
                        </FancyPopupFooter>
                    </FancyPopupContent>
                </FancyPopup>
            </div>

            {/* feat: Animation showcase grid */}
            <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                    Quick Preview - All Variants:
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {animationVariants.map(({ variant, label, icon }) => (
                        <FancyPopup key={variant}>
                            <FancyPopupTrigger asChild>
                                <Button
                                    variant='outline'
                                    className='h-20 flex flex-col items-center gap-2'
                                >
                                    {icon}
                                    <span className='text-xs'>{label}</span>
                                </Button>
                            </FancyPopupTrigger>
                            <FancyPopupContent
                                animation={variant}
                                icon={icon}
                                className='sm:max-w-[300px]'
                            >
                                <FancyPopupHeader animation={variant}>
                                    <FancyPopupTitle animation={variant}>
                                        {label} Demo
                                    </FancyPopupTitle>
                                    <FancyPopupDescription animation={variant}>
                                        This is a {label.toLowerCase()}{' '}
                                        animation demo.
                                    </FancyPopupDescription>
                                </FancyPopupHeader>
                                <FancyPopupFooter animation={variant}>
                                    <FancyPopupClose asChild>
                                        <Button size='sm'>Got it!</Button>
                                    </FancyPopupClose>
                                </FancyPopupFooter>
                            </FancyPopupContent>
                        </FancyPopup>
                    ))}
                </div>
            </div>
        </div>
    )
}
