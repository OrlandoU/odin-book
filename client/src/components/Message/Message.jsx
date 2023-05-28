import { useContext, useMemo } from "react";
import { getPostFormatted } from "../../functions/posts";
import { UserContext } from "../../contexts/UserContext";
import { removeMessagesForCurrentUser, updateMessage } from "../../functions/chat";
import { TokenContext } from "../../contexts/TokenContext";
import HiddenMenu from '../HiddenMenu'

export default function Message(props) {
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

    const timeOffset = useMemo(() => {
        if (!props.prevMessage) {
            return true
        }

        const messageTime = new Date(props.create_date).getTime()
        const prevTime = new Date(props.prevMessage.create_date).getTime()
        if (messageTime - prevTime < 600000) {
            return false
        } else {
            return true
        }
    }, [props.create_date, props.prevMessage])


    const handleRemove = async () => {
        const response = await updateMessage(token, props._id, props.chat_id, undefined, true)
        console.log(response)
    }

    const handleUnsent = async () => {
        const response = await updateMessage(token, props._id, props.chat_id, true)
        console.log(response)
    }

    const handleCopy = async () => {
        navigator.clipboard.writeText(props.content)
    }

    console.log(props)

    if (props.isFirst) {
        return (
            <div className='first-message'>
                <div className="first-message-user">
                    <img src={props.chatUser.profile} alt="Chat user" />
                </div>
                <div className="first-message-username">{props.chatUser.first_name} {props.chatUser.last_name}</div>
                <div className="first-message-data">
                    <div>Odinbook</div>
                    <div>
                        {props.relationship._id && props.relationship.request_state === 'Accepted' ? "You're" : "You're not"} friends on Odinbook</div>
                </div>
            </div>
        )
    }

    return (
        <div className={user._id === props.user_id._id ? "message mine" : 'message'}>
            {timeOffset && <div className="message-time">
                {getPostFormatted(props.create_date)}
            </div>}
            <div className="message-content" >
                {user._id !== props.user_id._id &&
                    <div className="message-user-pic">
                        <img src={props.user_id.profile} alt="" />
                    </div>}
                {user._id === props.user_id._id &&
                    <HiddenMenu className={'message reverse mine'}>
                        <span onClick={handleUnsent}>Unsent</span>
                        <span onClick={handleRemove}>Remove</span>
                        <span onClick={handleCopy}>Copy</span>
                    </HiddenMenu>}
                <div className="message-content-message">{props.content}</div>

                {user._id !== props.user_id._id &&
                    <HiddenMenu className={'message reverse'}>
                        <span onClick={handleRemove}>Remove</span>
                        <span onClick={handleCopy}>Copy</span>
                    </HiddenMenu>}
            </div>
        </div>
    )
}