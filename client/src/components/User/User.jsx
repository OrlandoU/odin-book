import { Route, Routes, useParams } from "react-router-dom"
import '../../assets/styles/User.css'
import Header from "./Header"
import { useContext, useEffect, useState } from "react"
import { getUserInfo } from "../../functions/user"
import { TokenContext } from "../../contexts/TokenContext"
import Main from "./Routes/Main"
import About from "./Routes/About"

export default function User() {
    const url = useParams()
    const tokenContext = useContext(TokenContext)
    const [user, setUser] = useState({})

    useEffect(() => {
        getUserInfo(tokenContext.token, url.userId).then(value => {
            if (value) {
                setUser(value)
            }
        })

    }, [url.userId])

    if (!user) {
        return null
    }

    return (
        <main>
            <Header {...user} />
            <Routes>
                <Route path="/" element={<Main {...user} />} />
                <Route path="/about/*" element={<About {...user} />} />
            </Routes>
        </main>
    )
}
