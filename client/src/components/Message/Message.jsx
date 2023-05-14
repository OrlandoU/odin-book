import { getPostFormatted } from "../../functions/posts";

export default function Message(props){
    return (
        <div className="message">
            <div className="message-time">
                {getPostFormatted(props.create_date)}
            </div>
            <div className="message-content">
                <div className="message-user-pic"></div>
                <div className="message-content-message">{props.content}</div>
            </div>
        </div>
    )
}