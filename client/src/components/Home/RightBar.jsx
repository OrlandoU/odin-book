import { useContext, useEffect, useState } from "react"
import { getFriends } from "../../functions/relationship"
import { TokenContext } from '../../contexts/TokenContext'
import { UserContext } from "../../contexts/UserContext"
import Contact from "./Contact"
import { getChats } from "../../functions/chat"

export default function RightBar() {
    const {token} = useContext(TokenContext)
    const [users, setUsers] = useState([])

    useEffect(() => {
        getChats(token).then(value => {
            setUsers(value)
        })
    }, [])

    return (
        <aside className="right-aside">
            <h2 className="sub-title">Contacts</h2>
            <div className="contacts-list">
                {users.map(user =>
                    <Contact {...user} key={user._id}/>
                )}
            </div>
        </aside>
    )
}