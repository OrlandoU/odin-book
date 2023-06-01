import { useContext, useEffect, useMemo } from "react";
import { getPostFormatted } from "../../functions/posts";
import { UserContext } from "../../contexts/UserContext";
import { updateMessage } from "../../functions/chat";
import { TokenContext } from "../../contexts/TokenContext";
import HiddenMenu from '../HiddenMenu'
import { useInView } from 'react-intersection-observer'

export default function Message(props) {
    const [ref, inView] = useInView()
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

    const messageState = useMemo(() => {
        if (props.isRead) {
            return 'read'
        } else if (props.isViewed) {
            return 'viewed'
        } else {
            return 'sended'
        }
    }, [props.isRead, props.isViewed])

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
        await updateMessage(token, props._id, props.chat_id, undefined, true)
    }

    const handleUnsent = async () => {
        await updateMessage(token, props._id, props.chat_id, true)
    }

    const handleCopy = async () => {
        navigator.clipboard.writeText(props.content)
    }


    useEffect(() => {
        if (inView && !props.isRead && props.user_id._id !== user._id) {
            updateMessage(token, props._id, props.chat_id, undefined, undefined, true, true).then(value => console.log(value))
        }
    }, [inView, props._id, props.chat_id, props.isRead, props.user_id._id, token, user._id])

    if (props.isUnsent) {
        return (
            <div className={user._id === props.user_id._id ? "unsent-message message mine " + messageState : "unsent-message " + messageState}>
                {timeOffset && <div className="message-time">
                    {getPostFormatted(props.create_date)}
                </div>}
                <div className="message-content" ref={ref}>
                    {user._id !== props.user_id._id &&
                        <div className="message-user-pic">
                            <img src={props.user_id.profile} alt="" />
                        </div>}
                    {user._id === props.user_id._id &&
                        <HiddenMenu className={'message reverse'}>
                            <span onClick={handleRemove}>Remove</span>
                            <span onClick={handleCopy}>Copy</span>
                        </HiddenMenu>}
                    <div className="message-content-message">{user._id === props.user_id._id ?
                        "You unsent a message" :
                        props.chatUser.first_name + " unsent a message"}</div>
                    {user._id !== props.user_id._id &&
                        <HiddenMenu className={'message reverse'} inView={inView} fixed>
                            <span onClick={handleRemove}>Remove</span>
                            <span onClick={handleCopy}>Copy</span>
                        </HiddenMenu>
                    }
                    <div className="message-state">
                        <svg id="viewed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-bold</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                        <img id="read" src={props.chatUser.profile} alt="User message" />
                        <svg id="sended" className="recent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-bold</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                    </div>
                </div>
            </div>
        )
    } else if (props.isFirst) {
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
        <div className={user._id === props.user_id._id ? "message mine " + messageState : 'message ' + messageState} style={!timeOffset ? { marginTop: '-14px' } : {}}>
            {timeOffset && <div className="message-time">
                {getPostFormatted(props.create_date)}
            </div>}
            <div className="message-content" ref={ref}>
                {user._id !== props.user_id._id &&
                    <div className="message-user-pic">
                        <img src={props.user_id.profile} alt="" />
                    </div>}
                {user._id === props.user_id._id &&
                    <HiddenMenu className={'message reverse mine'} inView={inView} fixed>
                        <span onClick={handleUnsent}>Unsent</span>
                        <span onClick={handleRemove}>Remove</span>
                        <span onClick={handleCopy}>Copy</span>
                    </HiddenMenu>}
                {props.content && <div className="message-content-message">{props.content}</div>}
                {props.media && <a href={props.media} target="_blank" rel="noreferrer" className="message-media"><img src={props.media} alt="Message Media" /></a>}
                {user._id !== props.user_id._id &&
                    <HiddenMenu className={'message reverse'} inView={inView} fixed>
                        <span onClick={handleRemove}>Remove</span>
                        <span onClick={handleCopy}>Copy</span>
                    </HiddenMenu>}

                <div className="message-state">
                    <svg id="viewed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-bold</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                    <img id="read" src={props.chatUser.profile} alt="User message" />
                    <svg id="sended" className="recent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-bold</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>
                </div>

            </div>
        </div>
    )
}