import { useContext, useEffect, useState } from "react";
import Section from "../../Section";
import { getPostsWithPhotos } from "../../../functions/posts";
import { TokenContext } from "../../../contexts/TokenContext";
import { NavLink, useParams } from "react-router-dom";

export default function Media(props) {
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPostsWithPhotos(token, url.userId)
            .then(value => {
                const arr = [].concat(...value.map(post => {
                    if (post.multiple_media.length > 0) {
                        return post.multiple_media.map(media => { return { _id: post._id, media: media } })
                    } else {
                        return post
                    }
                }))
                setPosts(arr)
            })
    }, [url.groupId, token, url.userId])

    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Photos</h2>
                {posts.length > 0 && <div className="group-media">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post._id} key={post.media}>
                            <img src={post.media} alt="Post media" />
                        </NavLink>
                    )}
                </div>}
            </Section>
        </div>
    )
}