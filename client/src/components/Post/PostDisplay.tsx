import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPosts } from "../../functions/posts"
import { Token, TokenContext } from "../../contexts/TokenContext"
import PostModal from "./PostModal"
import Post from "../../interfaces/Post"

export default function PostDisplay(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const url = useParams()
    const [post, setPost] = useState<Post>()

    useEffect(() => {
        getPosts(token, { _id: url.postId })
            .then(value => {
               value && setPost(value[0])
            })
        document.body.click()
    }, [url.postId])


    return (
        <main className="main-home">
            <section className="post-expanded">
                {post && <PostModal {...post} isExpanded/>}
            </section>
        </main>
    )
}