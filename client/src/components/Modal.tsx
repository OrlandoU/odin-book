import { useState, JSX, ComponentProps, ReactNode} from "react"

interface ModalProps extends ComponentProps<'div'> {
    children?: ReactNode,
    trigger?: ReactNode,
    title?: string,
    modalClass?: string,
    classname?: string,
    postId?: string
}

type VoidFunction = () => void

export default function Modal({ children, trigger, title, modalClass ,classname, onClick, postId }: ModalProps): JSX.Element  {
    const [visible, setVisible] = useState<boolean | undefined>()

    const hide: VoidFunction = () => {
        setVisible(false)
    }

    const show: VoidFunction = () => {
        setVisible(true)
    }

    return (
        <div className={"modal-wrapper " + modalClass} >
            <div className="trigger-wrapper" onClick={show} id={'post' + postId}>
                {trigger}
            </div>
            {visible && <div className="modal-container" onClick={hide}>
                <div className={"wrapper " + classname} onClick={(e) => {onClick && onClick(e); e.stopPropagation()}}>
                    <h2 className="modal-header">
                        {title}
                        <svg onClick={hide} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
                    </h2>
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </div>}
        </div>
    )
}