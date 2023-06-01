import { NavLink, useParams } from "react-router-dom"
import Edit from "./Edit/Edit"
import { useContext, useEffect, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { acceptFriendRequest, getRelationship, removeFriend, sendFriendRequest } from "../../functions/relationship"
import { createChat, getChatWithUser } from "../../functions/chat"
import { UserContext } from "../../contexts/UserContext"
import { ChatContext } from "../../contexts/ChatContext"

export default function Header(props) {
    const url = useParams()

    const { addChat } = useContext(ChatContext)
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)

    const [chat, setChat] = useState({})
    const [relationship, setRelationship] = useState({})

    const handleMessage = async () => {
        if (!chat) {
            const newChat = await createChat(token, url.userId)
            console.log(newChat)
            addChat(newChat)
        } else {
            addChat(chat)
        }
    }

    const handleAcceptRequest = () => {
        acceptFriendRequest(token, url.userId)
            .then(req => {
                console.log(req)
                setRelationship(req)
            })
    }

    const handleSendRequest = () => {
        sendFriendRequest(token, url.userId)
            .then(req => setRelationship(req))
    }

    const handleRemoveRequest = () => {
        removeFriend(token, url.userId)
            .then(req => setRelationship({}))

    }

    useEffect(() => {
        getRelationship(token, url.userId)
            .then(res => setRelationship(res || {}))

        getChatWithUser(token, url.userId)
            .then(res => setChat(res))
    }, [token, url.userId])


    return (
        <header className="user-header">
            <div className="header-wrapper">
                <div className="cover">
                    {props.cover && <img src={props.cover} alt="Profile cover" />}
                </div>
                <div className="user-info">
                    <div className="user-profile-pic">
                        <div className="user-profile-pic-wrapper">
                            {props.profile && <img src={props.profile} alt="" />}
                        </div>
                    </div>
                    <div className="user-details">
                        <div className="user-name">{props.first_name} {props.last_name}</div>
                        <div className="user-friends-count">{props.friends.length} {props.friends !== 1 ? 'Friends' : 'Friend'}</div>
                        <div className="user-friends-pics">
                            {props.friends.map(friend =>
                                <NavLink to={'/' + friend._id + '/'} className={'friend-pic'}>
                                    <img src={friend.profile} alt="Friend preview" />
                                </NavLink>
                            )}
                        </div>
                    </div>

                    <div className="user-options">
                        {url.userId !== user._id && relationship.request_state === 'Accepted' &&
                            <div className="user-option" onClick={handleRemoveRequest}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-check</title><path d="M21.1,12.5L22.5,13.91L15.97,20.5L12.5,17L13.9,15.59L15.97,17.67L21.1,12.5M10,17L13,20H3V18C3,15.79 6.58,14 11,14L12.89,14.11L10,17M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4Z" /></svg>
                                Friend
                            </div>
                        }
                        {(url.userId !== user._id && relationship.request_state === 'Pending' && relationship.sender_id === user._id) &&
                            <div className="user-option group" onClick={handleRemoveRequest}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-remove</title><path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" /></svg>
                                Cancel request
                            </div>
                        }
                        {(url.userId !== user._id && relationship.request_state === 'Pending' && relationship.sender_id !== user._id) &&
                            <div className="user-option group" onClick={handleAcceptRequest}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-check</title><path d="M21.1,12.5L22.5,13.91L15.97,20.5L12.5,17L13.9,15.59L15.97,17.67L21.1,12.5M10,17L13,20H3V18C3,15.79 6.58,14 11,14L12.89,14.11L10,17M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4Z" /></svg>
                                Respond
                            </div>
                        }
                        {url.userId !== user._id && !relationship._id &&
                            <div className="user-option group" onClick={handleSendRequest}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-plus</title><path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" /></svg>
                                Add friend
                            </div>
                        }
                        {url.userId !== user._id &&
                            <div className="user-option group" onClick={handleMessage}>
                                <svg viewBox="0 0 28 28" alt="" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0" fill="currentColor" height="20" width="20"><path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path></svg>
                                Message
                            </div>}

                        <Edit />
                    </div>
                </div>
                {(relationship.request_state === 'Pending' && relationship.sender_id !== user._id) &&
                    <div className="user-relationship-confirm-wrapper">
                        <div className="user-relationship-confirm">
                            <div className="sub-title-smaller">{props.first_name} sent you a friend request</div>
                            <div className="user-options">
                                <div className="user-option group" onClick={handleAcceptRequest}>Confirm request</div>
                                <div className="user-option" onClick={handleRemoveRequest}>Delete request</div>
                            </div>
                        </div>
                    </div>}
                <div className="user-routes">
                    <div className="user-routes-wrapper">
                        <NavLink to={'./'}>Posts</NavLink>
                        <NavLink to={'./about'}>About</NavLink>
                        <NavLink to={'./friends'}>Friends</NavLink>
                        <NavLink to={'./photos'}>Photos</NavLink>
                        <NavLink to={'./videos'}>Videos</NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}