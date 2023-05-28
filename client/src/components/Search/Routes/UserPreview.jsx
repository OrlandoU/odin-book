import { useContext, useEffect, useState } from "react"
import { TokenContext } from "../../../contexts/TokenContext"
import { getRelationship } from "../../../functions/relationship"
import { UserContext } from "../../../contexts/UserContext"
import { NavLink } from "react-router-dom"

export default function UserPreview({ user }) {
    const thisUser = useContext(UserContext)
    const { token } = useContext(TokenContext)
    const [relationship, setRelationship] = useState({})

    useEffect(() => {
        getRelationship(token, user._id)
            .then(rel => setRelationship(rel))
    }, [])

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