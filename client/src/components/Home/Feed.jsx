import Post from "../Post/Post";
import PostForm from "../Post/PostForm";

export default function Feed({posts, setPosts}) {

    return (
        <section className="feed">
            <PostForm setPosts={setPosts}/>
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} setPosts={setPosts}/>
                )}
            </div>
        </section>
    )
}