import { useEffect, useRef, useState, MouseEventHandler, ReactNode} from "react"

interface HiddenMenuProps {
    children?: ReactNode,
    className?: string,
    onVisible?: () => void,
    fixed?: boolean,
    inView?: boolean
}

export default function HiddenMenu({ children, className, onVisible, fixed }: HiddenMenuProps): JSX.Element {
    const [distanceX, setDistanceX] = useState<number>(0)
    const [distanceY, setDistanceY] = useState<number>(0)
    const ref = useRef<HTMLDivElement | null>(null)
    const [visible, setVisible] = useState<boolean>(false)

    const hide = (): void => {
        setVisible(false)
    }

    const show: MouseEventHandler = (e) => {
        const viewport = (e.target as HTMLElement).getBoundingClientRect()
        if (fixed) {
            setDistanceX(viewport.x)
            setDistanceY(viewport.y)
        }
        e.preventDefault()
        e.stopPropagation()
        document.body.click()
        if (onVisible) onVisible()
        setVisible(true)
    }

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            let target: Node | null = event.target as Node
            if (ref.current && !ref.current.contains(target)) {
                hide();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className={"options " + className}>
            <svg className="hiddenmenu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={show}><title>dots-horizontal</title><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>
            {visible && <div className="options-available" ref={ref} style={fixed ? { top: distanceY + 'px', left: distanceX + 'px' } : {}}>
                <svg className="hidden-delt" height="12" viewBox="0 0 21 12" width="21"><path d="M20.685.12c-2.229.424-4.278 1.914-6.181 3.403L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V.12h20.684z"></path></svg>
                {children}
            </div>}
        </div>
    )
}