import React, { ReactNode } from "react"

export default function LeftBar({children}: {children: ReactNode}): JSX.Element{
    return (
        <aside className="user-aside">
            {children}
        </aside>
    )
}