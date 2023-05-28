import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { TokenContext } from "../../../../contexts/TokenContext"
import { queryPosts } from "../../../../functions/posts"
import { NavLink, useParams } from "react-router-dom"

export default function PublicPhotos() {
    const url = useParams()
    const fetching = useRef()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback(() => {
        if (fetching.current) return

        fetching.current = true
        queryPosts(token, url.search, true, false, posts.length === 0 ? 25 : 15, posts.length === 0 ? 0 : posts.length + 1).then((value) => {
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

    useEffect(()=>{
        fetchPosts()
    }, [])

    return (
        <div className="search-users search-container row">
                <div className="search-images-container">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post.id} key={post._id} className={'image-navlink'}>
                            <img src={post.media} alt="Post photo" />
                        </NavLink>
                    )}
                </div>
        </div>
    )
}