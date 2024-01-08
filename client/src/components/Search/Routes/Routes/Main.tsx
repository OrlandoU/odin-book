import { useCallback, useContext, useEffect, useState } from "react"
import { Token, TokenContext } from "../../../../contexts/TokenContext"
import { queryPosts } from "../../../../functions/posts"
import { NavLink, useParams } from "react-router-dom"
import User from "../../../../interfaces/User"

interface PostMedia {
    media?: string, id?: string, user_id?: string | User
}

export default function Main(): JSX.Element {
    const url = useParams()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<PostMedia[]>([])  
    const [publicPosts, setPublicPosts] = useState<PostMedia[]>([])

    const fetchPosts = useCallback(() => {
        if(!token || !url.search) return
        queryPosts(token, url.search, true, true, '9', '0').then((value) => {
            // const arr = [].concat(...value.map(post => {
            //     if (post.multiple_media.length > 0) {
            //         return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
            //     } else {
            //         return { media: post.media, id: post._id, user_id: post.user_id }
            //     }
            // }))
            if(!value) return
            const arr = value.flatMap(post => {
                if (post.multiple_media && post.multiple_media.length > 0) {
                    return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                } else {
                    return { media: post.media, id: post._id, user_id: post.user_id }
                }
            })
            setPosts(arr)
        })
    }, [token, url])

    const fetchPublicPosts = useCallback(() => {
        if(!token || !url.search) return
        queryPosts(token, url.search, true, false, '9', '0').then((value) => {
            // const arr = [].concat(...value.map(post => {
            //     if (post.multiple_media.length > 0) {
            //         return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
            //     } else {
            //         return { media: post.media, id: post._id, user_id: post.user_id }
            //     }
            // }))
            if (!value) return
            const arr = value.flatMap(post => {
                if (post.multiple_media && post.multiple_media.length > 0) {
                    return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                } else {
                    return { media: post.media, id: post._id, user_id: post.user_id }
                }
            })
            setPublicPosts(arr)
        })
    }, [token, url])

    useEffect(() => {
        fetchPosts()
        fetchPublicPosts()
    }, [fetchPosts, fetchPublicPosts])


    return (
        <div className="search-users search-container">
            <div className="search-element">
                <h2 className="sub-title">Photos from friends and groups</h2>
                <div className="search-images-preview">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post.id} key={post.id} className={'image-navlink'}>
                            <img src={post.media} alt="Post photo" />
                            {post.user_id && typeof post.user_id !== 'string' && <div className="image-author">By {post.user_id.first_name} {post.user_id.last_name}</div>}
                        </NavLink>
                    )}
                </div>
                <NavLink to={'./friends-groups'} className="user-option">See all</NavLink>
            </div>

            <div className="search-element">
                <h2 className="sub-title">Public photos</h2>
                <div className="search-images-preview">
                    {publicPosts.map(post =>
                        <NavLink to={'/photo/' + post.id} key={post.id} className={'image-navlink'}>
                            <img src={post.media} alt="Post" />
                        </NavLink>
                    )}
                </div>
                <NavLink to={'./public'} className="user-option">See all</NavLink>
            </div>
        </div>
    )
}