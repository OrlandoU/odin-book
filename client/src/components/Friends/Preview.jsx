import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../contexts/UserContext'
import { TokenContext } from '../../contexts/TokenContext'
import { getFriendInCommon } from "../../functions/relationship";
import { NavLink } from "react-router-dom";

export default function Preview(props) {
    const token = useContext(TokenContext).token
    const user = useContext(UserContext)
    const [friend, setFriend] = useState({})

    useEffect(() => {
        if (props.unwrapped) {
            setFriend(props)
        } else {
            if (props.user1_id._id === user._id) {
                setFriend(props.user2_id)
            } else {
                setFriend(props.user1_id)
            }
        }
    }, [])

    if(props.residence){
        return (
            <NavLink to={'/' + friend._id} className="friend-preview">
                <div className="friend-preview-pic">
                    <img src={friend.profile} alt="" />
                </div>
                <div className="friend-data">
                    <div className="friend-preview-name">{friend.first_name} {friend.last_name}</div>
                    <div className="friends-preview-common post-data">{friend.current_place}</div>
                </div>
            </NavLink>
        )
    }

    return (
        <NavLink to={'./' + friend._id} className="friend-preview">
            <div className="friend-preview-pic">
                <img src={friend.profile} alt="" />
            </div>
            <div className="friend-data">
                <div className="friend-preview-name">{friend.first_name} {friend.last_name}</div>
                <div className="friends-preview-common"></div>
            </div>
        </NavLink>
    )
}