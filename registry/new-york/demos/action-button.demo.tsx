import React from 'react'

import ActionButton from '@/registry/new-york/components/action-button/action-button'

const ActionButtonDemo: React.FC<ActionButtonDemoProps> = () => {
    return (
        <>
            <ActionButton popupContent={<div>Hello from popup!</div>}>
                Click Me
            </ActionButton>
        </>
    )
}

type ActionButtonDemoProps = {}

export default ActionButtonDemo
