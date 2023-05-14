import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { getChatLastMessage } from "../../functions/chat"
import { TokenContext } from "../../contexts/TokenContext"
import { getPostFormatted } from "../../functions/posts"
import { ChatContext } from "../../contexts/ChatContext"

export default function ChatPreview(props) {
    const token = useContext(TokenContext).token
    const user = useContext(UserContext)
    const {addChat} = useContext(ChatContext)
    const [chatUser, setChatUser] = useState({})
    const [lastMessage, setLastMessage] = useState({})

    const handleClick = () => {
        addChat(props)
    }

    useEffect(() => {
        getChatLastMessage(token, props._id).then(value => {
            setLastMessage(value)
        })
        setChatUser(props.participants.find(participant => participant._id !== user._id))
    }, [])

    return (
        <div className="chat-preview" onClick={handleClick}>
            <div className="chat-profile"></div>
            <div className="chat-data">
                <div className="chat-name">{chatUser.first_name} {chatUser.last_name}</div>
                <div className="chat-last-message">
                    {lastMessage.user_id === user._id ? 'You:' : ''} {lastMessage.content} · {getPostFormatted(lastMessage.create_date)}
                </div>
            </div>
        </div>
    )
}