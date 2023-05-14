import { useEffect, useState } from "react"

export default function HiddenMenu({ children }) {
    const [visible, setVisible] = useState(false)

    const hide = () => {
        setVisible(false)
    }

    const show = (e) => {
        e.stopPropagation()
        setVisible(true)
    }
    useEffect(()=>{
        window.addEventListener('click', hide)

        return ()=>{
            window.removeEventListener('click', hide)
        }
    }, [])

    return (
        <div className="options" onClick={(e)=>e.stopPropagation()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={show}><title>dots-horizontal</title><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>
            {visible && <div className="options-available">
                {children}
            </div>}
        </div>
    )
}