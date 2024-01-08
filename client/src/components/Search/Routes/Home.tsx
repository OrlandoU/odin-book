import { NavLink, useParams } from "react-router-dom";
import EmptySearch from "../EmptySearch";
import { useCallback, useContext, useEffect, useState } from "react";
import { queryPosts } from "../../../functions/posts";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import User from "../../../interfaces/User";

interface Post {
    media?: string, id?: string, user_id?: string | User
}

export default function Home(): JSX.Element {
    const url = useParams()
    const { token } = useContext(TokenContext) as Token
    const [publicPosts, setPublicPosts] = useState<Post[]>([])

    const fetchPublicPosts = useCallback(() => {
        if(!token || !url.search) return
        queryPosts(token, url.search, true, false, '6', '0').then((value) => {
            // const arr = value && [].concat(...value.map((post) => {
            //     if (post.multiple_media.length > 0) {
            //         return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
            //     } else {
            //         return { media: post.media, id: post._id, user_id: post.user_id }
            //     }
            // }))
            if(!value) return
            const arr: Post[] = value.flatMap(((post) => {
                if (post.multiple_media && post.multiple_media.length > 0) {
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
                        <NavLink to={'/photo/' + post.id} key={post.id} className='image-navlink'>
                            <img src={post.media} alt="Post" />
                        </NavLink>
                    )}
                </div>
                <NavLink to={'./public'} className="user-option">See all</NavLink>
            </div>
        </div>

    )
}