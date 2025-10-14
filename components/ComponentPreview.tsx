import { ComponentPreviewTabs } from '@/components/ComponentPreviewTabs'
import { ComponentSource } from '@/components/ComponentSource'
import { Index } from '@/registry/__index__'

export default function ComponentPreview({
    name,
    type,
    className,
    align = 'center',
    hideCode = false,
    chromeLessOnMobile = false,
    ...props
}: React.ComponentProps<'div'> & {
    name: string
    align?: 'center' | 'start' | 'end'
    description?: string
    hideCode?: boolean
    type?: 'block' | 'component' | 'example'
    chromeLessOnMobile?: boolean
}) {
    const Component = Index[name]?.component

    if (!Component) {
        return (
            <p className='text-muted-foreground mt-6 text-sm'>
                Component{' '}
                <code className='bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm'>
                    {name}
                </code>{' '}
                not found in registry.
            </p>
        )
    }

    return (
        <ComponentPreviewTabs
            className={className}
            align={align}
            hideCode={hideCode}
            component={<Component />}
            source={<ComponentSource name={name} collapsible={false} />}
            chromeLessOnMobile={chromeLessOnMobile}
            {...props}
        />
    )
}
