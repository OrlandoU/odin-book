import { useContext, useEffect, useState } from "react"
import { getFriends } from "../../functions/relationship"
import { TokenContext } from '../../contexts/TokenContext'
import { UserContext } from "../../contexts/UserContext"

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
            console.log(filteredValues)
            setUsers(filteredValues)
        })
    }, [])

    return (
        <aside className="right-aside">
            <h2 className="sub-title">Contacts</h2>
            <div className="contacts-list">
                {users.map(user =>
                    <div className="contact">
                        <div className="contact-img">{user.media}</div>
                        <div className="contact-name">{user.first_name} {user.last_name}</div>
                    </div>
                )}
            </div>
        </aside>
    )
}