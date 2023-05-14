import { useContext, useEffect, useState } from "react";
import { getFeedPosts } from "../../functions/posts";
import Post from "../Post/Post";
import { TokenContext } from "../../contexts/TokenContext";
import PostForm from "../Post/PostForm";

export default function Feed() {
    const token = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getFeedPosts(token.token).then((value) => {
            setPosts(value)
        })
    }, [])

    return (
        <section className="feed">
            <PostForm />
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} />
                )}
            </div>
        </section>
    )
}