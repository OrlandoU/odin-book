import { NavLink } from "react-router-dom"
import { getPostFormattedAlt } from "../../functions/posts"
import NotificationI from "../../interfaces/Notification"

import angry from '../../assets/images/angry.svg'
import care from '../../assets/images/care.svg'
import haha from '../../assets/images/haha.svg'
import like from '../../assets/images/like.svg'
import logo from '../../assets/images/logo.svg'
import love from '../../assets/images/love.svg'
import mention from '../../assets/images/mention.svg'
import sad from '../../assets/images/sad.svg'
import wow from '../../assets/images/wow.svg'

import { updateNotification } from "../../functions/notification"
import { useContext, useState, MouseEventHandler } from "react"
import { Token, TokenContext } from '../../contexts/TokenContext'
import { acceptFriendRequest, removeFriend } from "../../functions/relationship"
import { UserContext } from "../../contexts/UserContext"

interface Props extends NotificationI{

}

export default function Notification(props: Props): JSX.Element {
    const [requestState, setRequestState] = useState(props.request)
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext) as Token
    const images: {[key: string]: string} = {
        angry, care, like, haha, logo, love, sad, wow
    }
    const handleClick: MouseEventHandler = () => {
        updateNotification(token, props._id, true)
    }

    const handleAcceptRequest: MouseEventHandler = (e) => {
        console.log('test')
        e.stopPropagation()
        e.preventDefault()
        if(typeof props.sender_id === 'string') return
        acceptFriendRequest(token, props.sender_id._id)
            .then(response => {
                response && setRequestState(response)
            })
    }

    const handleAbortRequest: MouseEventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (typeof props.sender_id === 'string') return
        removeFriend(token, props.sender_id._id)
            .then(response => {
                response && setRequestState(response)
            })
    }

    if (requestState && typeof requestState !== 'string' && requestState.request_state === 'Accepted' && requestState.sender_id !== user!._id) {
        return <></>
    }

    if (!props.post || typeof props.sender_id === 'string' || typeof props.group === 'string' || typeof props.post === 'string' || typeof props.reaction === 'string' || typeof props.post.group === 'string'){
        return <></>
    }

    return (
        <NavLink to={props.type === 'request' ? "/" + props.sender_id._id : props.type === 'invite' ? '/groups/' + props.group!._id + '/' : '/post/' + props.post!._id} className={props.isVisited ? 'notification visited' : 'notification'} onClick={handleClick}>
            <div className="notification-user">
                <img src={props.sender_id.profile} alt="Notification user" />
                <div className="notification-icon">
                    {(props.type === 'post_mention' || props.type === 'comment_mention' || props.type === 'reply' || props.type === 'comment') && <img src={mention} alt="Notification type icon" className="mention" />}
                    {(props.type === 'post_reaction' || props.type === 'comment_reaction') && <img src={props.reaction && images[props.reaction.type]} alt="Notification type icon" />}
                </div>
            </div>
            <div className="notification-content-wrapper">
                <div className="notification-content">
                    <div className="notification-text">
                        <span className="notification-strong">
                            {props.sender_id.first_name} {props.sender_id.last_name}
                        </span>
                        {props.type === 'comment' && !props.post.group && ' commented your post.'}
                        {props.type === 'comment' && props.post.group && <span> commented your post in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {props.type === 'reply' && !props.post.group && ' replied to your comment.'}
                        {props.type === 'reply' && props.post.group && <span> replied to your comment. in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {props.type === 'comment_mention' && !props.post.group && ' mention you in a comment.'}
                        {props.type === 'comment_mention' && props.post.group && <span> mention you in a comment in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {props.type === 'post_mention' && !props.post.group && ' mention you in a post.'}
                        {props.type === 'post_mention' && props.post.group && <span> mention you in a post in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {props.type === 'request'}
                        {props.type === 'post'}
                        {props.type === 'post_reaction' && !props.post.group && ' reacted to your post.'}
                        {props.type === 'post_reaction' && props.post.group && <span> reacted to your post in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {props.type === 'comment_reaction' && !props.post.group && ' reacted to your comment.'}
                        {props.type === 'comment_reaction' && props.post.group && <span> reacted to your comment in <span className="notification-strong">{props.post.group.name}</span>.</span>}
                        {typeof requestState !== 'string' && requestState && requestState.request_state === 'Accepted' && <span> accepted your friend request.</span>}
                        {typeof requestState !== 'string' && requestState && requestState.request_state === 'Pending' && <span> sent you a friend request.</span>}
                        {props.type === 'invite' && <span> invited you to join <span className="notification-strong">{props.group && props.group.name}</span>.</span>}
                    </div>
                    {typeof requestState !== 'string' && requestState && requestState.request_state === 'Pending' &&
                        <div className="friend-preview-buttons" style={{ marginTop: '4px' }}>
                            <div className="user-option group" onClick={handleAcceptRequest}>Confirm</div>
                            <div className="user-option" onClick={handleAbortRequest}>Delete</div>
                        </div>}
                    <div className="notification-date">{props.create_date && getPostFormattedAlt(props.create_date)}</div>
                </div>
                <div className="notification-dot">
                    {!props.isVisited && <span></span>}
                </div>
            </div>
        </NavLink>
    )
}