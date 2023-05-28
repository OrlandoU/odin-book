import { Route, Routes, useParams } from "react-router-dom"
import Header from "./Header"
import Main from "./Routes/Main"
import { useContext, useEffect, useState } from "react"
import { getGroupInfo, getGroupMembers } from "../../../functions/group"
import { TokenContext } from "../../../contexts/TokenContext"
import Aside from "../../Aside"
import Preview from "../Preview"
import People from "./Routes/People"
import Media from "./Routes/Media"
import { leaveGroup } from "../../../functions/group"

export default function Detail() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const [group, setGroup] = useState({})
    const [members, setMembers] = useState({})

    const handleLeaveGroup = async () => {
        const response = await leaveGroup(token, url.groupId)
        console.log(response)
    }

    useEffect(() => {
        getGroupMembers(token, url.groupId).then(value => setMembers(value))
        getGroupInfo(token, url.groupId).then(value => setGroup(value))
    }, [url.groupId])

    if (!group) {
        return null
    }

    return (
        <div className="group-details-wrapper flex">
            <Aside>
                <Preview {...group} members={members} isExpanded />
                <div className="leave-group user-option" onClick={handleLeaveGroup}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-minus</title><path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M1,10V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" /></svg>
                    Leave Group
                </div>
            </Aside>
            <main>
                <Header {...group} members={members} />
                <Routes>
                    <Route path="/" element={<Main {...group} />} />
                    <Route path="/people" element={<People {...group} />} />
                    <Route path="/media" element={<Media />} />
                </Routes>
            </main>
        </div>
    )
}