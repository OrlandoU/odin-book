import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { TokenContext } from "../../../../contexts/TokenContext"
import { queryPosts } from "../../../../functions/posts"
import { NavLink, useParams } from "react-router-dom"

export default function FriendPhotos() {
    const url = useParams()
    const fetching = useRef()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(() => {
        if (fetching.current) return

        fetching.current = true
        queryPosts(token, url.search, true, true, posts.length === 0 ? 5 : 2, posts.length === 0 ? 0 : posts.length + 1).then((value) => {
            const arr = [].concat(...value.map(post => {
                if (post.multiple_media.length > 0) {
                    return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                } else {
                    return { media: post.media, id: post._id, user_id: post.user_id }
                }
            }))
            setPosts(prev => [...prev, ...arr])
            fetching.current = false
        })
    }, [posts.length, token, url])

    const handleScroll = (e) => {
        if (e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
            fetchPosts()
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return (
        <div className="search-users search-container row" onScroll={handleScroll}>
            <div className="search-images-container">
                {posts.map(post =>
                    <NavLink to={'/photo/' + post.id} key={post._id} className={'image-navlink'}>
                        <img src={post.media} alt="Post" />
                        <div className="image-author">By {post.user_id.first_name} {post.user_id.last_name}</div>
                    </NavLink>
                )}
            </div>
        </div>
    )
}