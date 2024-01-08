import { JSX, ReactNode } from "react"

interface SectionProps {
    children?: ReactNode,
    title?: string,
    noTitle?: boolean,
    className?: string
}

export default function Section({children, title, noTitle, className}: SectionProps): JSX.Element{
    if(noTitle){
        return (
            <section className={"user-section " + className}>
                {children}
            </section>
        )
    }
    return (
        <section className={"user-section " + className}>
            <h2 className="sub-title">{title}</h2>
            {children}
        </section>
    )
}