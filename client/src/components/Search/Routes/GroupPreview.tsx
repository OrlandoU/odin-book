import { useContext, useEffect, useState } from "react"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import { UserContext } from "../../../contexts/UserContext"
import { NavLink } from "react-router-dom"
import { getGroupLastActive, getGroupMembersCount } from "../../../functions/group"
import { getPostFormattedAlt } from "../../../functions/posts"
import Group from "../../../interfaces/Group"
import User from "../../../interfaces/User"

export default function GroupPreview(props: Group): JSX.Element {
    const user = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token
    const [members, setMembers] = useState<number>(0)
    const [lastActive, setLastActive] = useState<string>()

    useEffect(() => {
        if(!token) return
        getGroupMembersCount(token, props._id)
            .then(res => res && setMembers(res))

        getGroupLastActive(token, props._id)
            .then(value => {
               value && setLastActive(getPostFormattedAlt(value))
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props._id, token])

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
                {user.groups && user.groups.find(group => typeof group !== 'string' && group._id === props._id) ?
                    <NavLink to={'/groups/' + props._id + '/'} className="group-create-link">View Group</NavLink> :
                    <NavLink to={'/' + user._id + '/'} className="group-create-link">Join</NavLink>
                }
            </div>
        </div>
    )
}