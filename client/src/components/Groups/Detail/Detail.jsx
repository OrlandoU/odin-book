import { Route, Routes, useParams } from "react-router-dom"
import Header from "./Header"
import Main from "./Routes/Main"
import { useContext, useEffect, useState } from "react"
import { getGroupInfo } from "../../../functions/group"
import { TokenContext } from "../../../contexts/TokenContext"
import Aside from "../../Aside"
import Preview from "../Preview"
import People from "./Routes/People"
import Media from "./Routes/Media"

export default function Detail() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const [group, setGroup] = useState({})

    useEffect(() => {
        getGroupInfo(token, url.groupId).then(value => setGroup(value))
    }, [url.groupId])

    if (!group) {
        return null
    }

    return (
        <div className="group-details-wrapper flex">
            <Aside>
                <Preview {...group} isExpanded/>
            </Aside>
            <main>
                <Header {...group} />
                <Routes>
                    <Route path="/" element={<Main {...group} />} />
                    <Route path="/people" element={<People {...group} />} />
                    <Route path="/media" element={<Media />} />
                </Routes>
            </main>
        </div>
    )
}