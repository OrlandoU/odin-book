import { Suspense, useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { TokenContext } from "../../contexts/TokenContext"
import '../../assets/styles/Home.css'
import Feed from "./Feed"
import RightBar from "./RightBar"
import PostLoading from '../Post/PostLoading'

export default function Home() {
    const tokenContext = useContext(TokenContext)
    const user = useContext(UserContext)

    const handleLogout = () => {
        tokenContext.setToken('')
    }

    return (
        <main className="main-home">
            <Suspense fallback={<PostLoading />} >
                <Feed />
            </Suspense>
            <RightBar />
        </main>
    )
}