import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { getGroupsFeedPosts } from "../../../functions/posts"
import { TokenContext } from "../../../contexts/TokenContext"
import Post from "../../Post/Post"

export default function Home() {
    const fetching = useRef()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(() => {
        console.log(posts.length)
        if (fetching.current) return

        fetching.current = true
        getGroupsFeedPosts(token, posts.length === 0 ? 5 : 2, posts.length === 0 ? 0 : posts.length + 1)
            .then(value => {
                setPosts(prev => [...prev, ...value])
                fetching.current = false
            })
    }, [posts.length, token])

    const handleScroll = (e) => {
        if (e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
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