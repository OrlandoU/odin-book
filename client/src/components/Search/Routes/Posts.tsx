import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { queryPosts } from "../../../functions/posts"
import { Token, TokenContext } from "../../../contexts/TokenContext"
import Post from '../../Post/Post'
import PostI from "../../../interfaces/Post"

export default function Posts(): JSX.Element {
    const fetching = useRef<boolean>()
    const url = useParams()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<PostI[]>([])

    const fetchPosts = useCallback(() => {
        if (fetching.current || !token || !url.search) return

        fetching.current = true
        queryPosts(token, url.search, false, false, posts.length === 0 ? '5' : '2', posts.length === 0 ? '0' : String(posts.length + 1)).then((value) => {
            value && setPosts(prev => [...prev, ...value])
            fetching.current = false
        })
    }, [posts.length, token, url.search])

    useEffect(() => {
        fetchPosts()
    }, [url.search])


    return (
        <div className="search-users search-container">
            {posts.map(post =>
                <Post {...post} key={post._id} />
            )}
        </div>
    )
}