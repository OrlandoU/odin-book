import { JSX, Dispatch, SetStateAction } from "react";
import PostI from "../../interfaces/Post";
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";

interface FeedProps {
    posts: PostI[],
    setPosts: Dispatch<SetStateAction<PostI[]>>
}

export default function Feed({posts, setPosts} : FeedProps): JSX.Element {

    return (
        <section className="feed">
            <PostForm setPosts={setPosts}/>
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} 
                    // setPosts={setPosts}
                    />
                )}
            </div>
        </section>
    )
}