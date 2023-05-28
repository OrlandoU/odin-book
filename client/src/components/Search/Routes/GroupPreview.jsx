import { useContext, useEffect, useState } from "react"
import { TokenContext } from "../../../contexts/TokenContext"
import { UserContext } from "../../../contexts/UserContext"
import { NavLink } from "react-router-dom"
import { getGroupLastActive, getGroupMembersCount } from "../../../functions/group"
import { getPostFormattedAlt } from "../../../functions/posts"

export default function GroupPreview(props) {
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)
    const [members, setMembers] = useState(0)
    const [lastActive, setLastActive] = useState()

    useEffect(() => {
        getGroupMembersCount(token, props._id)
            .then(rel => setMembers(rel.count))

        getGroupLastActive(token, props._id)
            .then(value => {
               setLastActive(getPostFormattedAlt(value))
            })
    }, [props._id])

    return (
        <div className="search-element">
            <div className="search-user">
                <div className="search-user-profile">
                    <img src={props.cover} alt="Group Cover" />
                </div>
                <div className="friend-data">
                    <div className="friend-preview-name">{props.name}</div>
                    <div className="friends-preview-common post-data"><span className="capitalize">{props.privacy} · {members} {members === 1 ? "member" : "members" } · Last Active {lastActive}</span></div>
                </div>
                {user.groups && user.groups.find(group => group._id === props._id) ?
                    <NavLink to={'/groups/' + props._id + '/'} className="group-create-link">View Group</NavLink> :
                    <NavLink to={'/' + user._id + '/'} className="group-create-link">Join</NavLink>
                }
            </div>
        </div>
    )
}