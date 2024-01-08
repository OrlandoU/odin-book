import { UIEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react"
import { getGroupsFeedPosts } from "../../../functions/posts"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import Post from "../../Post/Post"
import PostI from "../../../interfaces/Post"

export default function Home(): JSX.Element {
    const fetching = useRef<boolean>()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<PostI[]>([])

    const fetchPosts = useCallback(() => {
        console.log(posts.length)
        if (fetching.current) return

        fetching.current = true
        getGroupsFeedPosts(token, posts.length === 0 ? '5' : '2', posts.length === 0 ? '0' : String(posts.length + 1))
            .then(value => {
                value && setPosts(prev => [...prev, ...value])
                fetching.current = false
            })
    }, [posts.length, token])

    const handleScroll: UIEventHandler = (e) => {
        const target = e.target as HTMLElement
        if (target.scrollHeight - 20 <= target.scrollTop + target.clientHeight) {
            fetchPosts()
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <main className="group-feed" onScroll={handleScroll}>
            <h3 className="post-data">Recent Activity</h3>
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} />
                )}
            </div>
        </main>
    )
}