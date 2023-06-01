import { useEffect, useRef, useState } from "react"

export default function NavModal(props) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const close = (event) => {
        if (event && event.target.className.animVal === 'hiddenmenu') {
            return
        }
        setVisible(false)
    }

    const open = (e) => {
        if (props.onVisible) props.onVisible()
        setVisible(true)
    }

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                close();
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
                    {(props.count > 0) && <span className="count">{props.count}</span>}
                    {props.svg}
                </div>
                <div className="nav-modal" style={!visible ? { display: 'none' } : {}}>
                {props.close && <div className="close-modal" onClick={(e) => { e.stopPropagation(); close() }}>
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
                {(props.count > 0) && <span className="count">{props.count}</span>}
                {props.svg}
            </div>
            <div className="nav-modal" style={{ visibility: visible ? 'visible' : 'hidden' }}>
                {props.close && <div className="close-modal" onClick={(e) => { e.stopPropagation(); close() }}>
                    {props.close}
                </div>}
                {props.children}
            </div>
        </div>
    )
}