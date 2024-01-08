import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import GroupPreview from "./GroupPreview"
import { queryGroups } from "../../../functions/group"
import EmptySearch from "../EmptySearch"
import Group from "../../../interfaces/Group"

export default function Groups(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const url = useParams()
    const [groups, setGroups] = useState<Group[]>([])

    useEffect(() => {
        if(!token || !url.search) return
        queryGroups(token, url.search).then(value => {
            value && setGroups(value)
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