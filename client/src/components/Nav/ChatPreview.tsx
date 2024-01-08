import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { getChatLastMessage, updateMessage } from "../../functions/chat"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { getPostFormatted } from "../../functions/posts"
import { ChatContI, ChatContext } from "../../contexts/ChatContext"
import { SocketContext } from "../../contexts/SocketContext"
import { useInView } from 'react-intersection-observer'
import Chat from "../../interfaces/Chat"
import User from "../../interfaces/User"
import { Socket } from "socket.io-client"
import Message from "../../interfaces/Message"

export default function ChatPreview(props: Chat): JSX.Element {
    const [ref, inView] = useInView()
    const socket: Socket | null = useContext(SocketContext)
    const { token } = useContext(TokenContext) as Token
    const user = useContext(UserContext) as User

    const { addChat } = useContext(ChatContext) as ChatContI
    const [chatUser, setChatUser] = useState<User>()
    const [lastMessage, setLastMessage] = useState<Message>()

    const handleClick = () => {
        setLastMessage((prev) => {
            if(prev === undefined) return
            return { ...prev, isRead: true }
        })
        addChat(props)
    }

    const handleInView = useCallback(() => {
        if (lastMessage && lastMessage._id) {
            updateMessage(token, lastMessage._id, props._id, undefined, undefined, undefined, true).then(value=>console.log(value))
        }
    }, [token, lastMessage, props._id])

    const timeFormatted = useMemo(() => {
        if (lastMessage) {
            return getPostFormatted(lastMessage.create_date)
        }
    }, [lastMessage])

    const handleSocket = useCallback(() => {
        const handleNewMessage = (message: Message) => {
            if (message.chat_id === props._id) {
                setLastMessage(message)
            } 
        }
        const handleUserChangeStatus = (user: User) => {
            if (chatUser && chatUser._id === user._id) {
                setChatUser(user)
            }
        }

        return { handleNewMessage, handleUserChangeStatus }
    }, [props._id, chatUser])

    useEffect(() => {
        getChatLastMessage(token, props._id).then(value => {
            if(value) setLastMessage(value)
        })
        if(user) setChatUser(props.participants.find(participant => participant._id !== user._id))
    }, [user, props._id, props.participants, token])


    useEffect(() => {
        if (inView) {
            handleInView()
        }
    }, [inView, handleInView])

    useEffect(() => {
        const { handleUserChangeStatus, handleNewMessage } = handleSocket()
        if(!socket) return
        if (socket.on) {
            socket.on('user_status', handleUserChangeStatus)
            socket.on('new_message', handleNewMessage)
        }
        return () => {
            socket.off('user_status', handleUserChangeStatus)
            socket.off('new_message', handleNewMessage)
        }

    }, [handleSocket, socket])

    if (!lastMessage || !user) {
        return <></>
    }

    return (
        <div className={lastMessage.isRead || lastMessage.user_id === user._id ? "chat-preview read" : "chat-preview"} onClick={handleClick}>
            <div className="chat-profile">
                <img src={chatUser && chatUser.profile} alt="" />
                {chatUser && chatUser.isOnline &&
                    <div className="user-online"></div>
                }
            </div>
            <div className="notification-content-wrapper">
                <div className="chat-data">
                    {chatUser && <div className="chat-name">{chatUser.first_name} {chatUser.last_name}</div>}
                    {lastMessage && <div className="chat-last-message" ref={ref}>
                        {lastMessage.user_id === user._id ? 'You:' : ''} {lastMessage.content} · {timeFormatted}
                    </div>}
                </div>
            </div>
            <div className="notification-dot">
                {(!lastMessage.isRead && lastMessage.user_id !== user._id) && <span></span>}
            </div>
        </div>
    )
}