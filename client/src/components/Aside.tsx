import { JSX } from 'react'
import React from 'react'

export default function Aside(props: {children: React.ReactNode[]}): JSX.Element{
    return (
        <aside className="main-aside">
            {props.children}
        </aside>
    )
}