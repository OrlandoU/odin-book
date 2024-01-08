/* eslint-disable react-hooks/exhaustive-deps */
import { Params, Route, Routes, useParams } from "react-router-dom"
import Header from "./Header"
import Main from "./Routes/Main"
import { useContext, useEffect, useState } from "react"
import { getGroupInfo, getGroupMembers } from "../../../functions/group"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import Aside from "../../Aside"
import Preview from "../Preview"
import People from "./Routes/People"
import Media from "./Routes/Media"
import { leaveGroup } from "../../../functions/group"
import { UpdateUserContext } from "../../../contexts/UpdateUserContext"
import Group from "../../../interfaces/Group"
import User from "../../../interfaces/User"

export default function Detail(): JSX.Element {
    const updateUser = useContext(UpdateUserContext)
    const { token } = useContext(TokenContext) as Token
    const url : Readonly<Params<string>> = useParams()
    const [group, setGroup] = useState<Group>()
    const [members, setMembers] = useState<User[]>([])

    const handleLeaveGroup = async () => {
        if(!url.groupId) return
        const response = await leaveGroup(token, url.groupId)
        updateUser && updateUser(token)
    }

    useEffect(() => {
        if(!url.groupId) return
        getGroupMembers(token, url.groupId).then(value => Array.isArray(value) && setMembers(value))
        getGroupInfo(token, url.groupId).then(value => value && setGroup(value))
    }, [url.groupId])

    if (!group) {
        return <></>
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
                    <Route path="/*" element={<Main {...group} />} />
                    <Route path="/people" element={<People {...group} />} />
                    <Route path="/media" element={<Media />} />
                </Routes>
            </main>
        </div>
    )
}