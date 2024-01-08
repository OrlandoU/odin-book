import React from 'react'

export default function LeftBar({ children }: {children: React.ReactNode}): JSX.Element{
    return (
        <aside className="user-aside">
            {children}
        </aside>
    )
}