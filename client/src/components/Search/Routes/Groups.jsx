import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TokenContext } from "../../../contexts/TokenContext"
import GroupPreview from "./GroupPreview"
import { queryGroups } from "../../../functions/group"
import EmptySearch from "../EmptySearch"

export default function Groups() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const [groups, setGroups] = useState([])

    useEffect(() => {
        queryGroups(token, url.search).then(value => {
            console.log(value)
            setGroups(value || [])
        })
    }, [url.search])

    if (!groups.length) {
        return (
            <EmptySearch />
        )
    }

    return (
        <div className="search-users search-container">
            {groups.map(group =>
                <GroupPreview {...group} />
            )}
        </div>
    )
}