import { useContext, useEffect, useState } from "react"
import { getFriends } from "../../functions/relationship"
import { TokenContext } from '../../contexts/TokenContext'
import { UserContext } from "../../contexts/UserContext"
import Contact from "./Contact"

export default function RightBar() {
    const user = useContext(UserContext)
    const tokenContext = useContext(TokenContext)
    const [users, setUsers] = useState([])

    useEffect(() => {
        getFriends(tokenContext.token).then(value => {
            const filteredValues = value.map(value=>{
                if(value.user1_id._id === user._id){
                    return value.user2_id
                } else {
                    return value.user1_id
                }
            })
            setUsers(filteredValues)
        })
    }, [])

    return (
        <aside className="right-aside">
            <h2 className="sub-title">Contacts</h2>
            <div className="contacts-list">
                {users.map(user =>
                    <Contact {...user}/>
                )}
            </div>
        </aside>
    )
}