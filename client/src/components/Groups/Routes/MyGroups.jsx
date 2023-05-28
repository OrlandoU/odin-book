import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"
import MainPreview from "../MainPreview"

export default function MyGroups() {
    const user = useContext(UserContext)

    if (!user._id) {
        return null
    }

    return (
        <div className="groups-container">
            <h3>All Groups you have joined ({user.groups.length})</h3>
            <div className="my-groups">
                {user.groups.map(group =>
                    <MainPreview {...group} myGroups key={group._id} />
                )}
            </div>
        </div>
    )
}