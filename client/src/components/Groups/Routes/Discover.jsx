import { useContext, useEffect, useState } from "react"
import { getGroups } from "../../../functions/group"
import { TokenContext } from "../../../contexts/TokenContext"
import { UserContext } from "../../../contexts/UserContext"
import MainPreview from "../MainPreview"

export default function Discover() {
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

    const [groups, setGroups] = useState([])

    useEffect(() => {
        getGroups(token)
            .then(values => {
                const filteredValues = values.filter(value => !(!!user.groups.find(group => group._id === value._id)))
                setGroups(filteredValues)
            })
    }, [user.groups, token])

    return (
        <div className="groups-container">
            <div className="groups-preview-header">
                <h2>Suggested Groups</h2>
                <p>Groups you might be interested in</p>
            </div>
            <div className="discover-groups">
                {groups.map(group =>
                    <MainPreview {...group} key={group._id}/>
                )}
            </div>
        </div>
    )
}