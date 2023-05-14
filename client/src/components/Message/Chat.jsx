import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { ChatContext } from "../../contexts/ChatContext"
import { TokenContext } from '../../contexts/TokenContext'
import { createMessage, getMessages } from "../../functions/chat"
import Message from "./Message"

export default function Chat(props) {
    const inputRef = useRef()
    const { token } = useContext(TokenContext)
    const { removeChat, hideChat } = useContext(ChatContext)
    const user = useContext(UserContext)

    const [chatUser, setChatUser] = useState({})
    const [messages, setMessages] = useState([])
    const [content, setContent] = useState('')

    const handleClose = () => {
        removeChat(props._id)
    }

    const handleMin = () => {
        hideChat(props._id)
    }

    const handleSubmit = () => {
        if (content.length > 0) {
            createMessage(token, props._id, content).then(message => {
                setMessages(prev => [...prev, message])
            })
        }
    }

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    useEffect(() => {
        console.log(inputRef)

        setChatUser(props.participants.find(participant => participant._id !== user._id))
        getMessages(token, props._id).then(value => setMessages(value))
    }, [])
    useEffect(() => {
        if (props.open) {
            inputRef.current.click()
            inputRef.current.focus()
        }
    }, [props.open])

    if (!props.open) {
        return null
    }

    return (
        <div className="main-chat">
            <div className="main-chat-header">
                <div className="main-chat-pic">
                    <div className="chat-pic-wrapper"></div>
                </div>
                <div className="main-chat-name">
                    {chatUser.first_name} {chatUser.last_name}
                </div>
                <div className="main-chat-options">
                    <svg onClick={handleMin} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>minus</title><path d="M19,13H5V11H19V13Z" /></svg>
                    <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
                </div>
            </div>
            <label className="main-chat-messages">
                {messages.map(message =>
                    <Message {...message} />
                )}
            </label>
            <div className="main-chat-input" >
                <div className="main-chat-input-options"></div>
                <input ref={inputRef} type="text" placeholder="Aa" onChange={handleContent} value={content} id={props._id + '-chat-input'} />
                <div onClick={handleSubmit} className="main-chat-send"><svg class="xsrhx6k" height="20px" viewBox="0 0 24 24" width="20px"><path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path></svg></div>
            </div>
        </div>
    )
}