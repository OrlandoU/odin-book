import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"
import MainPreview from "../MainPreview"
import User from "../../../interfaces/User"
import Group from "../../../interfaces/Group"

export default function MyGroups(): JSX.Element {
    const user = useContext(UserContext) as User

    if (!user._id) {
        return <></>
    }

    return (
        <div className="groups-container">
            <h3>All Groups you have joined ({user.groups.length})</h3>
            <div className="my-groups">
                {user.groups.map(group =>{ 
                    if(typeof group !== 'string'){
                        return <MainPreview {...group} myGroups={user.groups as Group[]} key={group._id} />
                    }
                    return <></>}
                )}
            </div>
        </div>
    )
}