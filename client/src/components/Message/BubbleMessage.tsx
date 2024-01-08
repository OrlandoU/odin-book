import { MouseEventHandler, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ChatContI, ChatContext } from "../../contexts/ChatContext"
import { UserContext } from "../../contexts/UserContext"
import { SocketContext } from "../../contexts/SocketContext"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { updateMessage } from "../../functions/chat"
import { useInView } from "react-intersection-observer"
import Message from "../../interfaces/Message"
import Chat from "../../interfaces/Chat"

export default function BubbleMessage(props: Chat): JSX.Element {
    const [ref, inView] = useInView()
    const { token } = useContext(TokenContext) as Token
    const [visible, setVisible] = useState<boolean>(false)
    const [messagesCount, setMessagesCount] = useState<number>(0)
    const [lastMessage, setLastMessage] = useState<Message>()

    const socket = useContext(SocketContext)
    const user = useContext(UserContext)
    const { showChat } = useContext(ChatContext) as ChatContI

    const filteredChat = useMemo(() => {
        if (!user) return
        if (props.participants[0]._id === user._id) {
            return { ...props, chatUser: props.participants[1] }
        } else {
            return { ...props, chatUser: props.participants[0] }
        }

    }, [props, user!._id])

    const handleClick: MouseEventHandler = () => {
        setMessagesCount(0)
        setLastMessage(undefined)
        showChat(props._id)
    }

    const handleInView = useCallback(() => {
        if (lastMessage) {
            updateMessage(token, lastMessage._id, props._id, null, null, null, true).then(value => console.log(value))
        }
    }, [token, lastMessage, props._id])

    const handleSocket = useCallback(() => {
        const handleNewMessage = (message: Message) => {
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
        if(!socket) return

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
        return <></>
    }

    return (
        <div className="bubble-pic" onClick={handleClick}>
            {messagesCount > 0 && <div className="bubble-messages-count">{messagesCount}</div>}
            {(lastMessage && typeof lastMessage.user_id !== 'string') && <div className={visible ? "message-preview chat-preview visible" : "message-preview chat-preview"} ref={ref}>
                <div className="chat-name">{lastMessage.user_id.first_name} {lastMessage.user_id.last_name}</div>
                <div className="chat-message"><span className="dot"></span> {lastMessage.content}</div>
                <div className="right-delt"></div>
            </div>}
            <img src={filteredChat && filteredChat.chatUser.profile} alt="" />
        </div>
    )
}