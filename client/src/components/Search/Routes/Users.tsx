import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { queryUser } from "../../../functions/user"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import UserPreview from "./UserPreview"
import EmptySearch from "../EmptySearch"
import User from "../../../interfaces/User"

export default function Users(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const url = useParams()
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if(!token || !url.search) return
        queryUser(token, url.search).then(value => {
            console.log(value)
            setUsers(value || [])
        })
    }, [token, url.search])

    if (!users.length) {
        return (
            <EmptySearch />
        )
    }

    return (
        <div className="search-users search-container">
            {users.map(user =>
                <UserPreview user={user} />
            )}
        </div>
    )
}