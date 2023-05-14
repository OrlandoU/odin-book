import { useContext } from "react"
import { ChatContext } from "../../contexts/ChatContext"

export default function BubbleMessage(props) {
    const { showChat } = useContext(ChatContext)

    const handleClick = () => {
        showChat(props._id)
    }

    return (
        <div className="bubble-pic" onClick={handleClick}></div>
    )
}