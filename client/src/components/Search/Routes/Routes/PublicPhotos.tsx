import { UIEventHandler, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Token, TokenContext } from "../../../../contexts/TokenContext"
import { queryPosts } from "../../../../functions/posts"
import { NavLink, useParams } from "react-router-dom"
import User from "../../../../interfaces/User"

interface PostMedia {
    media?: string, id?: string, user_id?: string | User
}

export default function PublicPhotos():JSX.Element {
    const url = useParams()
    const fetching = useRef<boolean>()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<PostMedia[]>([])

    const fetchPosts = useCallback(() => {
        if (fetching.current || !token || !url.search) return

        fetching.current = true
        queryPosts(token, url.search, true, false, posts.length === 0 ? '25' : '15', posts.length === 0 ? '0' : String(posts.length + 1)).then((value) => {
            if(!value) return
            const arr = value.flatMap(post => {
                if (post.multiple_media && post.multiple_media.length > 0) {
                    return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                } else {
                    return { media: post.media, id: post._id, user_id: post.user_id }
                }
            })
            setPosts(prev => [...prev, ...arr])
            fetching.current = false
        })
    }, [posts.length, token, url])

    const handleScroll: UIEventHandler = (e) => {
        const target = e.target as HTMLElement
        if (target.scrollHeight - 20 <= target.scrollTop + target.clientHeight) {
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
                        <NavLink to={'/photo/' + post.id} key={post.id} className={'image-navlink'}>
                            <img src={post.media} alt="Post photo" />
                        </NavLink>
                    )}
                </div>
        </div>
    )
}