import { useCallback, useContext, useEffect, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { useParams } from "react-router-dom"
import Aside from "../Aside"
import { getPosts } from "../../functions/posts"
import { UserContext } from "../../contexts/UserContext"
import PostSavedPreview from "./PostSavedPreview"

export default function PostSaved() {
    const [posts, setPosts] = useState([])

    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)

    const removePost = (id) => {
        setPosts(prev => prev.filter(post => post._id !== id))
    }

    const fetchPosts = useCallback(() => {
        getPosts(token, { saved: user._id })
            .then(res => setPosts(res || []))
    }, [token, user._id])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return (
        <div className="group-details-wrapper flex">
            <Aside>
                <h2>Saved Posts</h2>
                <div className="border-line"></div>
                <section>
                    <div class="svg-wrapper">
                        {posts.length}
                    </div>
                    <span>Total posts</span>
                </section>
            </Aside>
            <main className="saved-posts-main">
                <div className="saved-posts-wrapper">

                    <div className="saved-posts">
                        <h2 className="subtitle">All</h2>
                        <div className="saved-posts-container">
                            {posts.map(post =>
                                <PostSavedPreview {...post} removePost={removePost} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}