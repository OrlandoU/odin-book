import { useContext } from "react"
import { ChatContext } from "../../contexts/ChatContext"
import Chat from "./Chat"
import BubbleMessage from "./BubbleMessage"


export default function Bubbles() {
    const openChats = useContext(ChatContext).openChats

    return (
        <div className="bubbles-container">
            <div className="chats">
                {openChats.map(chat =>
                    <Chat {...chat} key={chat._id}/>
                )}
            </div>
            <div className="bubbles">
                {openChats.filter(chat => !chat.open).map(chat =>
                    <BubbleMessage {...chat} key={chat._id} />
                )}
            </div>
        </div>
    )
}