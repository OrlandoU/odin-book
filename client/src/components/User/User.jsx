import { useContext, useEffect, useState } from "react"
import { getPosts } from "../../functions/posts"
import { TokenContext } from "../../contexts/TokenContext"
import { useParams } from "react-router-dom"
import Post from "../Post/Post"

export default function User(){
    const tokenContext =useContext(TokenContext)
    const url = useParams()
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        getPosts(tokenContext.token, {user_id: url.userId}).then(value=>{
            setPosts(value)
        })
    }, [])

    return (
        <main>
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} />
                )}
            </div>
        </main>
    )
}
