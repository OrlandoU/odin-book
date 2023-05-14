import { useContext } from "react"
import { ChatContext } from "../../contexts/ChatContext"

export default function Contact(props){
    
    const addChat = useContext(ChatContext).addChat

    const handleClick = () => {
        addChat(props._id)
    }

    return (
        <div className="contact">
            <div className="contact-img">{props.media}</div>
            <div className="contact-name">{props.first_name} {props.last_name}</div>
        </div>
    )
}