import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPosts, getReactions } from "../../functions/posts"
import { TokenContext } from "../../contexts/TokenContext"
import PostModal from "./PostModal"

export default function PostDisplay() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const [post, setPost] = useState({})

    useEffect(() => {
        getPosts(token, { _id: url.postId })
            .then(value => {
                setPost(value[0])
            })
        document.body.click()
    }, [url.postId])


    return (
        <main className="main-home">
            <section className="post-expanded">
                {post._id && <PostModal {...post} isExpanded/>}
            </section>
        </main>
    )
}