import { useContext, useEffect, useState } from "react"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import { getRelationship } from "../../../functions/relationship"
import { UserContext } from "../../../contexts/UserContext"
import { NavLink } from "react-router-dom"
import User from "../../../interfaces/User"
import Relationship from "../../../interfaces/Relationship"

export default function UserPreview({ user }: {user: User}): JSX.Element {
    const thisUser = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token
    const [relationship, setRelationship] = useState<Relationship>()

    useEffect(() => {
        if(!token) return 
        getRelationship(token, user._id)
            .then(res => res && setRelationship(res))
    }, [token, user._id])

    return (
        <div className="search-element">
            <div className="search-user">
                <div className="search-user-profile">
                    <img src={user.profile} alt="Searched user profile" />
                </div>
                <div className="friend-data">
                    <div className="friend-preview-name">{user.first_name} {user.last_name}</div>
                    <div className="friends-preview-common post-data">{user.current_place} {(user.jobs.length > 0) && ' · ' + user.jobs[0]}</div>
                </div>
                {thisUser._id === user._id && <NavLink to={'/' + user._id + '/'} className="group-create-link">View Profile</NavLink>}
                {(thisUser._id !== user._id &&!relationship) && <div className="group-create-link">Add friend</div>}
            </div>
        </div>
    )
}