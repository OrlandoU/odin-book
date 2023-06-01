import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { getChatLastMessage, updateMessage } from "../../functions/chat"
import { TokenContext } from "../../contexts/TokenContext"
import { getPostFormatted } from "../../functions/posts"
import { ChatContext } from "../../contexts/ChatContext"
import { SocketContext } from "../../contexts/SocketContext"
import { useInView } from 'react-intersection-observer'

export default function ChatPreview(props) {
    const [ref, inView] = useInView()
    const socket = useContext(SocketContext)
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

    const { addChat } = useContext(ChatContext)
    const [chatUser, setChatUser] = useState({})
    const [lastMessage, setLastMessage] = useState({})

    const handleClick = () => {
        setLastMessage(prev => {
            return { ...prev, isRead: true }
        })
        addChat(props)
    }

    const handleInView = useCallback(() => {
        if (lastMessage._id) {
            updateMessage(token, lastMessage._id, props._id, undefined, undefined, undefined, true).then(value=>console.log(value))
        }
    }, [token, lastMessage._id, props._id])

    const timeFormatted = useMemo(() => {
        if (lastMessage) {
            return getPostFormatted(lastMessage.create_date)
        }
    }, [lastMessage])

    const handleSocket = useCallback(() => {
        const handleNewMessage = (message) => {
            if (message.chat_id === props._id) {
                setLastMessage(message)
            } 
        }
        const handleUserChangeStatus = (user) => {
            if (chatUser._id === user._id) {
                setChatUser(user)
            }
        }

        return { handleNewMessage, handleUserChangeStatus }
    }, [props._id, chatUser])

    useEffect(() => {
        getChatLastMessage(token, props._id).then(value => {
            setLastMessage(value || {})
        })
        setChatUser(props.participants.find(participant => participant._id !== user._id))
    }, [user, props._id, props.participants, token])


    useEffect(() => {
        if (inView) {
            handleInView()
        }
    }, [inView, handleInView])

    useEffect(() => {
        const { handleUserChangeStatus, handleNewMessage } = handleSocket()
        if (socket.on) {
            socket.on('user_status', handleUserChangeStatus)
            socket.on('new_message', handleNewMessage)
        }
        return () => {
            socket.off('user_status', handleUserChangeStatus)
            socket.off('new_message', handleNewMessage)
        }

    }, [handleSocket, socket])

    if (!lastMessage._id) {
        return null
    }

    return (
        <div className={lastMessage.isRead || lastMessage.user_id === user._id ? "chat-preview read" : "chat-preview"} onClick={handleClick}>
            <div className="chat-profile">
                <img src={chatUser.profile} alt="" />
                {chatUser.isOnline &&
                    <div className="user-online"></div>
                }
            </div>
            <div className="notification-content-wrapper">
                <div className="chat-data">
                    <div className="chat-name">{chatUser.first_name} {chatUser.last_name}</div>
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