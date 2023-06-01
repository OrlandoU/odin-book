import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ChatContext } from "../../contexts/ChatContext"
import { UserContext } from "../../contexts/UserContext"
import { SocketContext } from "../../contexts/SocketContext"
import { TokenContext } from "../../contexts/TokenContext"
import { updateMessage } from "../../functions/chat"
import { useInView } from "react-intersection-observer"

export default function BubbleMessage(props) {
    const [ref, inView] = useInView()
    const { token } = useContext(TokenContext)
    const [visible, setVisible] = useState(false)
    const [messagesCount, setMessagesCount] = useState(0)
    const [lastMessage, setLastMessage] = useState({})

    const socket = useContext(SocketContext)
    const user = useContext(UserContext)
    const { showChat } = useContext(ChatContext)

    const filteredChat = useMemo(() => {
        if (props.participants[0]._id === user._id) {
            return { ...props, chatUser: props.participants[1] }
        } else {
            return { ...props, chatUser: props.participants[0] }
        }

    }, [props, user._id])

    const handleClick = () => {
        setMessagesCount(0)
        setLastMessage({})
        showChat(props._id)
    }

    const handleInView = useCallback(() => {
        if (lastMessage._id) {
            updateMessage(token, lastMessage._id, props._id, undefined, undefined, undefined, true).then(value => console.log(value))
        }
    }, [token, lastMessage._id, props._id])

    const handleSocket = useCallback(() => {
        const handleNewMessage = (message) => {
            if (message.chat_id === props._id && !props.open) {
                setMessagesCount(prev => prev + 1)
                setLastMessage(message)
                show()
            } if (message.chat_id === props._id && props.open) {
                setMessagesCount(0)
            }
        }
        return { handleNewMessage }
    }, [props._id, props.open])

    useEffect(() => {
        if (inView) {
            handleInView()
        }
    }, [inView, handleInView])


    useEffect(() => {
        const { handleNewMessage } = handleSocket()
        if (socket.on) {
            socket.on('new_message', handleNewMessage)
        }
        return () => {
            socket.off('new_message', handleNewMessage)
        }
    }, [handleSocket, socket])

    const show = () => {
        setVisible(true)
        setTimeout(() => {
            setVisible(false)
        }, 5000)
    }

    if (props.open) {
        return null
    }

    return (
        <div className="bubble-pic" onClick={handleClick}>
            {messagesCount > 0 && <div className="bubble-messages-count">{messagesCount}</div>}
            {(lastMessage._id) && <div className={visible ? "message-preview chat-preview visible" : "message-preview chat-preview"} ref={ref}>
                <div className="chat-name">{lastMessage.user_id.first_name} {lastMessage.user_id.last_name}</div>
                <div className="chat-message"><span className="dot"></span> {lastMessage.content}</div>
                <div className="right-delt"></div>
            </div>}
            <img src={filteredChat.chatUser.profile} alt="" />
        </div>
    )
}