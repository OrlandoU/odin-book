import { NavLink, useParams } from "react-router-dom";
import EmptySearch from "../EmptySearch";
import { useCallback, useContext, useEffect, useState } from "react";
import { queryPosts } from "../../../functions/posts";
import { TokenContext } from "../../../contexts/TokenContext";

export default function Home() {
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [publicPosts, setPublicPosts] = useState([])

    const fetchPublicPosts = useCallback(() => {
        queryPosts(token, url.search, true, false, 6, 0).then((value) => {
            const arr = [].concat(...value.map((post) => {
                if (post.multiple_media.length > 0) {
                    return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                } else {
                    return { media: post.media, id: post._id, user_id: post.user_id }
                }
            }))
            setPublicPosts(arr.slice(0, 6))
        })
    }, [token, url])

    useEffect(() => {
        fetchPublicPosts()
    }, [fetchPublicPosts])


    return (
        <div className="search-users search-container">
            <div className="search-element">
                <h2 className="sub-title">Public photos</h2>
                <div className="search-images-preview">
                    {publicPosts.map(post =>
                        <NavLink to={'/photo/' + post.id} key={post._id} className={'image-navlink'}>
                            <img src={post.media} alt="Post photo" />
                        </NavLink>
                    )}
                </div>
                <NavLink to={'./public'} className="user-option">See all</NavLink>
            </div>
        </div>

    )
}