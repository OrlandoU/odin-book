import { useContext, useEffect, useState } from "react";
import { getPosts } from "../../functions/posts";
import Post from "../Post/Post";
import { TokenContext } from "../../contexts/TokenContext";
import PostForm from "../Post/PostForm";

export default function Feed() {
    const token = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts(token.token).then((value) => {
            console.log(value)
            setPosts(value)
        })
    }, [])

    return (
        <section className="feed">
            <PostForm />
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} />
                )}
            </div>
        </section>
    )
}