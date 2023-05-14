import { useContext, useEffect, useState } from "react";
import LeftBar from "../LeftBar";
import Section from "../../Section";
import Post from '../../Post/Post'
import { getPosts } from "../../../functions/posts";
import { TokenContext } from "../../../contexts/TokenContext";
import { useParams } from "react-router-dom";

export default function Main(props) {
    const url = useParams()
    const tokenContext = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts(tokenContext.token, { user_id: url.userId }).then(value => {
            setPosts(value || [])
        }).catch(error=>{
            console.error('Error fetching posts', error)
        })
    }, [])

    return (
        <div className="user-data">
            <LeftBar>
                <Section title={'Details'} />
            </LeftBar>
            <div className="posts-container">
                {posts.map(post =>
                    <Post {...post} key={post._id} />
                )}
            </div>
        </div>
    )
}