import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../contexts/UserContext'
import { TokenContext } from '../../contexts/TokenContext'
import { acceptFriendRequest, getFriendInCommon, getRelationship, removeFriend, sendFriendRequest } from "../../functions/relationship";
import { NavLink } from "react-router-dom";

export default function Preview(props) {
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

    const [friend, setFriend] = useState({})
    const [friendsInCommon, setFriendsInCommon] = useState([])
    const [requestSent, setRequestSent] = useState(false)

    const handleSendRequest = (e) => {
        e.stopPropagation()
        e.preventDefault()
        sendFriendRequest(token, friend._id)
            .then(response => {
                setRequestSent(true)
                console.log(response)
            })
    }

    const handleAbortRequest = (e) => {
        e.stopPropagation()
        e.preventDefault()
        removeFriend(token, friend._id)
            .then(response => {
                console.log(response)
                setRequestSent(false)
            })
    }

    const handleAcceptRequest = (e) => {
        e.stopPropagation()
        e.preventDefault()
        acceptFriendRequest(token, friend._id)
            .then(response => {
                console.log(response)
            })
    }

    useEffect(() => {
        if (props.unwrapped) {
            setFriend(props)
            getRelationship(token, props._id)
            .then(value=> {
                if(value){
                    setRequestSent(true)
                }
            })
        } else {
            if (props.user1_id._id === user._id) {
                setFriend(props.user2_id)
            } else {
                setFriend(props.user1_id)
            }
        }
    }, [])

    useEffect(() => {
        if (props.friendsInCommon) {
            getFriendInCommon(token, friend._id)
                .then(values => {
                    setFriendsInCommon(values)
                })
        }
    }, [friend])

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