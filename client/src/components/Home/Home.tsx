import { Suspense, useCallback, useContext, useEffect, useRef, useState, JSX, UIEventHandler } from "react"
import { Token, TokenContext } from "../../contexts/TokenContext"
import '../../assets/styles/Home.css'
import Feed from "./Feed"
import RightBar from "./RightBar"
import PostLoading from '../Post/PostLoading'
import { getFeedPosts } from "../../functions/posts"
import Post from "../../interfaces/Post"

export default function Home(): JSX.Element {
    const fetching = useRef<boolean>()
    const { token, setToken } = useContext(TokenContext) as Token 
    const [posts, setPosts] = useState<Post[]>([])

    const fetchPosts = useCallback(() => {
        if (fetching.current) return

        fetching.current = true
        getFeedPosts(token, posts.length === 0 ? 5 : 2, posts.length === 0 ? 0 : posts.length + 1).then((value) => {
            setPosts(prev => [...prev, ...value])
            fetching.current = false
        })
    }, [posts.length, token])

    const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const targetElement = e.target as HTMLElement
        if (targetElement.scrollHeight - 20 <= targetElement.scrollTop + targetElement.clientHeight) {
            fetchPosts()
        }
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