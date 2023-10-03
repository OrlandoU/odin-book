import { useContext, useEffect, useState, JSX } from "react"
import { getFriends } from "../../functions/relationship"
import { Token, TokenContext } from '../../contexts/TokenContext'
import { UserContext } from "../../contexts/UserContext"
import Contact from "./Contact"
import { getChats } from "../../functions/chat"
import Chat from "../../interfaces/Chat"

export default function RightBar(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const [chats, setChats] = useState<Chat[]>([])

    useEffect(() => {
        getChats(token).then((value: Chat[]) => {
            setChats(value)
        })
    }, [])

    return (
        <aside className="right-aside">
            <h2 className="sub-title">Contacts</h2>
            <div className="contacts-list">
                {chats.map((chat: Chat)=>
                    <Contact {...chat} key={chat._id} />
                )}
            </div>
        </aside>
    )
}