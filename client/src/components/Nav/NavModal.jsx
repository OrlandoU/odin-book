import { useEffect, useRef, useState } from "react"

export default function NavModal(props) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const close = (event) => {
        setVisible(false)
    }

    const open = (e) => {
        e.stopPropagation()
        setVisible(true)
    }

    useEffect(() => {
        window.addEventListener('click', close)

        return () => {
            window.removeEventListener('focus', close)
        }
    }, [])

    return (
        <div className="nav-svg" onClick={open} ref={ref}>
            {props.svg}
            {visible &&
                <div className="nav-modal">
                    {props.children}
                </div>
            }
        </div>
    )
}