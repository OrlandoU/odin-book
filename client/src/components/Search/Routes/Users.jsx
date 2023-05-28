import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { queryUser } from "../../../functions/user"
import { TokenContext } from "../../../contexts/TokenContext"
import UserPreview from "./UserPreview"
import EmptySearch from "../EmptySearch"

export default function Users() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const [users, setUsers] = useState([])

    useEffect(() => {
        queryUser(token, url.search).then(value => {
            console.log(value, url)
            setUsers(value || [])
        })
    }, [url.search])

    if(!users.length){
        return (
            <EmptySearch />
        )
    }

    return (
        <div className="search-users search-container">
            {users.map(user =>
                <UserPreview user={user}/>
            )}
        </div>
    )
}