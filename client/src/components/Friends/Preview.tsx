import { useContext, useEffect, useState, MouseEventHandler } from "react";
import { UserContext } from '../../contexts/UserContext'
import { Token, TokenContext } from '../../contexts/TokenContext'
import { acceptFriendRequest, getFriendInCommon, getRelationship, removeFriend, sendFriendRequest } from "../../functions/relationship";
import { NavLink } from "react-router-dom";
import User from "../../interfaces/User";
import Relationship from "../../interfaces/Relationship";


interface PreviewProps{
    unwrapped?: boolean,
    friendsInCommon?: boolean,
    residence?: boolean,
    suggestion?: boolean,
    requests?: boolean,
    user?: User,
    relationship?: Relationship  
}

export default function Preview(props: PreviewProps): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const user: User | null = useContext(UserContext)

    const [friend, setFriend] = useState<User | null>()
    const [friendsInCommon, setFriendsInCommon] = useState<Relationship[]>([])
    const [requestSent, setRequestSent] = useState<boolean>(false)

    const handleSendRequest: MouseEventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        if(friend){
            sendFriendRequest(token, friend._id)
            .then(response => {
                setRequestSent(true)
                console.log(response)
            })
        }
    }

    const handleAbortRequest: MouseEventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        if(friend){
            removeFriend(token, friend._id)
            .then(response => {
                console.log(response)
                setRequestSent(false)
            })
        }
    }

    const handleAcceptRequest: MouseEventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()

        if(friend){
            acceptFriendRequest(token, friend._id)
            .then(response => {
                console.log(response)
            })
        }
    }

    useEffect(() => {
        if (props.unwrapped && props.user) {
            setFriend(props.user)
            getRelationship(token, props.user._id)
            .then(value=> {
                if(value){
                    setRequestSent(true)
                }
            })
        } else if (props.relationship && typeof props.relationship.user1_id !== 'string' && typeof props.relationship.user2_id !== 'string') {
            if (user &&  props.relationship.user1_id._id === user._id) {
                setFriend(props.relationship.user2_id)
            } else {
                setFriend(props.relationship.user1_id)
            }
        }
    }, [user, props, token])

    useEffect(() => {
        if (props.friendsInCommon && friend) {
            getFriendInCommon(token, friend._id)
                .then(values => {
                    if(values){
                        setFriendsInCommon(values)
                    }
                })
        }
    }, [friend, token, props.friendsInCommon])

    if(!friend){
        return <></>
    }

    if (props.residence) {
        return (
            <NavLink to={'/' + friend._id} className="friend-preview">
                <div className="friend-preview-pic">
                    <img src={friend.profile} alt="" />
                </div>
                <div className="friend-data">
                    <div className="friend-preview-name">{friend.first_name} {friend.last_name}</div>
                    <div className="friends-preview-common post-data">{friend.current_place} </div>
                </div>
            </NavLink>
        )
    }

    return (
        <NavLink to={'./' + friend._id} className="friend-preview">
            <div className="friend-preview-pic">
                <img src={friend.profile} alt="" />
            </div>
            <div className={!requestSent ? "friend-data" : "friend-data sent"}>
                <div className="friend-preview-name">
                    {friend.first_name} {friend.last_name}
                    {requestSent && <div>Request Sent</div>}
                </div>
                {friendsInCommon.length > 0 && <div className="friends-preview-common"></div>}
                {props.suggestion &&
                    <div className="friend-preview-buttons">
                        {!requestSent && <div className="user-option group" onClick={handleSendRequest}>Add Friend</div>}
                        {!requestSent && <div className="user-option">Remove</div>}
                        {requestSent && <div className="user-option" onClick={handleAbortRequest}>Cancel</div>}
                    </div>
                }
                {props.requests &&
                    <div className="friend-preview-buttons">
                        <div className="user-option group" onClick={handleAcceptRequest}>Confirm</div>
                        <div className="user-option" onClick={handleAbortRequest}>Delete</div>
                    </div>
                }
            </div>
        </NavLink>
    )
}