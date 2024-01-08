import { useCallback, useContext, useEffect, useState } from "react"
import { Token, TokenContext } from "../../contexts/TokenContext"
import Aside from "../Aside"
import { getPosts } from "../../functions/posts"
import { UserContext } from "../../contexts/UserContext"
import PostSavedPreview from "./PostSavedPreview"
import User from "../../interfaces/User"
import Post from "../../interfaces/Post"

export default function PostSaved(): JSX.Element {
    const [posts, setPosts] = useState<Post[]>([])

    const user = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token

    const removePost = (id: string): void => {
        setPosts(prev => prev.filter(post => post._id !== id))
    }

    const fetchPosts = useCallback((): void => {
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
                    <div className="svg-wrapper">
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