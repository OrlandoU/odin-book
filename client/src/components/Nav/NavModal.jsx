import { useEffect, useRef, useState } from "react"

export default function NavModal(props) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const close = (event) => {
        if(event.target.className.animVal === 'hiddenmenu'){
            return 
        }
        setVisible(false)
    }

    const open = (e) => {
        e.stopPropagation()
        if (props.onVisible) props.onVisible()
        setVisible(true)
    }

    const toggle = (e) => {
        e.stopPropagation()
        setVisible(prev=>!prev)
    }

    useEffect(() => {
        window.addEventListener('click', close, {capture: true})

        return () => {
            window.removeEventListener('click', close, { capture: true })
        }
    }, [])

    return (
        <div className={!props.isNested ? "nav-svg" : 'nav-nested'} onClick={open} ref={ref}>
            <div className="svg-container" onClick={toggle}>
                {(props.count > 0) && <span className="count">{props.count}</span>}
                {props.svg}
            </div>
            <div className="nav-modal" style={{ visibility: visible ? 'visible' : 'hidden' }}>
                {props.close && <div className="close-modal" onClick={(event) => { event.stopPropagation(); close() }}>
                    {props.close}
                </div>}
                {props.children}
            </div>
        </div>
    )
}