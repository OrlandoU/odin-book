import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { queryPosts } from "../../../functions/posts"
import { TokenContext } from "../../../contexts/TokenContext"
import Post from '../../Post/Post'

export default function Posts() {
    const fetching = useRef()
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(() => {
        if (fetching.current) return

        fetching.current = true
        queryPosts(token, url.search, false, false, posts.length === 0 ? 5 : 2, posts.length === 0 ? 0 : posts.length + 1).then((value) => {
            setPosts(prev => [...prev, ...value])
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