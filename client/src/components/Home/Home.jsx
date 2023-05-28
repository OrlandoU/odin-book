import { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import '../../assets/styles/Home.css'
import Feed from "./Feed"
import RightBar from "./RightBar"
import PostLoading from '../Post/PostLoading'
import { getFeedPosts } from "../../functions/posts"

export default function Home() {
    const tokenContext = useContext(TokenContext)
    const fetching = useRef()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(() => {
        if (fetching.current) return

        fetching.current = true
        getFeedPosts(token, posts.length === 0 ? 5 : 2, posts.length === 0 ? 0 : posts.length + 1).then((value) => {
            setPosts(prev => [...prev, ...value])
            fetching.current = false
        })
    }, [posts.length, token])

    const handleScroll = (e) => {
        if (e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
            fetchPosts()
        }
    }

    const handleLogout = () => {
        tokenContext.setToken('')
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <main className="main-home" onScrollCapture={handleScroll}>
            <Suspense fallback={<PostLoading />} >
                <Feed posts={posts} setPosts={setPosts}/>
            </Suspense>
            <RightBar />
        </main>
    )
}