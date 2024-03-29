import { useContext, useEffect, useMemo, useState } from "react"
import { ChatContI, ChatContext } from "../../contexts/ChatContext"
import { UserContext } from "../../contexts/UserContext"
import { SocketContext } from "../../contexts/SocketContext"
import Chat from "../../interfaces/Chat"
import User from "../../interfaces/User"
import { Socket } from "socket.io-client"

export default function Contact(props: Chat) {
    const socket = useContext(SocketContext) as Socket
    const user = useContext(UserContext) as User
    const { addChat } = useContext(ChatContext) as ChatContI
    const [isOnline, setIsOnline] = useState(false)

    const filteredChat = useMemo(() => {
        if (props.participants[0]._id === user._id) {
            setIsOnline(props.participants[1].isOnline)
            return { ...props, chatUser: props.participants[1] }
        } else {
            setIsOnline(props.participants[0].isOnline)
            return { ...props, chatUser: props.participants[0] }
        }

    }, [props, user._id])

    const handleClick = () => {
        addChat(filteredChat)
    }

    useEffect(() => {
        const handleUserChangeStatus = (user: User) => {
            if (user._id === filteredChat.chatUser._id) {
                setIsOnline(user.isOnline)
            }
        }
        socket.on('user_status', handleUserChangeStatus)
        return () => {
            socket.off('user_status', handleUserChangeStatus)
        }
    }, [filteredChat.chatUser, socket])

    if (!filteredChat) {
        return null
    }

    return (
        <div className="contact" onClick={handleClick}>
            <div className="contact-img">
                <img src={filteredChat.chatUser.profile} alt="Contact" />
                {isOnline && <div className="user-online"></div>}
            </div>
            <div className="contact-name">{filteredChat.chatUser.first_name} {filteredChat.chatUser.last_name}</div>
        </div>
    )
}