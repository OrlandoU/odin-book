import { useEffect, useRef, useState } from "react"

export default function HiddenMenu({ children, className, onVisible }) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const hide = () => {
        setVisible(false)
    }

    const show = (e) => {
        e.stopPropagation()
        document.body.click()
        if (onVisible) onVisible()
        setVisible(true)
    }

    useEffect(() => {
        window.addEventListener('click', hide)

        return () => {
            window.removeEventListener('click', hide)
        }
    }, [])

    return (
        <div className={"options " + className}>
            <svg className="hiddenmenu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={show}><title>dots-horizontal</title><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>
            {visible && <div className="options-available" ref={ref}>
                <svg className="hidden-delt" height="12" viewBox="0 0 21 12" width="21"><path d="M20.685.12c-2.229.424-4.278 1.914-6.181 3.403L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V.12h20.684z"></path></svg>
                {children}
            </div>}
        </div>
    )
}