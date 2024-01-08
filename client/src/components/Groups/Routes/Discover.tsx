import { useContext, useEffect, useState } from "react"
import { getGroups } from "../../../functions/group"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import { UserContext } from "../../../contexts/UserContext"
import MainPreview from "../MainPreview"
import Group from "../../../interfaces/Group"

export default function Discover(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const user = useContext(UserContext)
    const [groups, setGroups] = useState<Group[]>([])

    useEffect(() => {
        getGroups(token)
            .then(values => {
                if(!values) return
                const filteredValues = values.filter(value => !(!!user!.groups.find(group => typeof group !== 'string' && group._id === value._id)))
                setGroups(filteredValues)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user!.groups, token])

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