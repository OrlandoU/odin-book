import { useEffect, useRef, useState, MouseEventHandler, ReactNode } from "react"

interface Props {
    onVisible?: () => void,
    isNested?: boolean,
    isDisplayNone?: boolean,
    count?: number,
    svg?: ReactNode,
    close?: ReactNode,
    children?: ReactNode
}

interface EventVariant extends MouseEventHandler<HTMLElement>, EventListener {
}

export default function NavModal(props: Props): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false)

    const close: EventVariant = (event) => {
        const target = event.target as HTMLElement
        if (event && target.className === 'hiddenmenu') {
            return
        }
        setVisible(false)
    }

    const open: MouseEventHandler = (e) => {
        if (props.onVisible) props.onVisible()
        setVisible(true)
    }

    useEffect(() => {
        const handleClick = (event: Event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                close(event);
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    if (props.isDisplayNone) {
        return (
            <div className={!props.isNested ? "nav-svg" : 'nav-nested'} onClick={open} ref={ref}>
                <div className="svg-container" onClick={open}>
                    {(props.count && props.count > 0) ? <span className="count">{props.count}</span> : <></>}
                    {props.svg}
                </div>
                <div className="nav-modal" style={!visible ? { display: 'none' } : {}}>
                    {props.close && <div className="close-modal" onClick={(e) => { e.stopPropagation(); close(e) }}>
                        {props.close}
                    </div>}
                    {props.children}
                </div>
            </div >
        )
    }

    return (
        <div className={!props.isNested ? "nav-svg" : 'nav-nested'} onClick={open} ref={ref}>
            <div className="svg-container" onClick={open}>
                {(props.count && props.count > 0) ? <span className="count">{props.count}</span> : <></>}
                {props.svg}
            </div>
            <div className="nav-modal" style={{ visibility: visible ? 'visible' : 'hidden' }}>
                {props.close && <div className="close-modal" onClick={(e) => { e.stopPropagation(); close(e) }}>
                    {props.close}
                </div>}
                {props.children}
            </div>
        </div>
    )
}