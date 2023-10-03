import { Location, Params, Route, Routes, useLocation, useParams } from "react-router-dom"
import '../../assets/styles/User.css'
import Header from "./Header"
import { useCallback, useContext, useEffect, useRef, useState, UIEventHandler } from "react"
import { getUserInfo } from "../../functions/user"
import { Token, TokenContext } from "../../contexts/TokenContext"
import Main from "./Routes/Main"
import About from "./Routes/About"
import { getFriends } from "../../functions/relationship"
import Media from "./Routes/Media"
import Friend from "./Routes/Friend"
import { getPosts } from "../../functions/posts"
import UserI from "../../interfaces/User"
import Post from "../../interfaces/Post"

export default function User(): JSX.Element {
    const location: Location = useLocation()
    const fetching: React.MutableRefObject<boolean> = useRef(false)
    const url: Readonly<Params<string>> = useParams()
    const { token } = useContext(TokenContext) as Token

    const [posts, setPosts] = useState<Post[]>([])
    const [user, setUser] = useState<UserI | null>()
    const [friends, setFriends] = useState<UserI[]>([])

    const fetchData = () => {
        if (url.userId) {
            getUserInfo(token, url.userId).then(value => {
                if (value) {
                    setUser(value)
                }
            })

            getFriends(token, url.userId)
                .then(value => {
                    const arr = !value ? [] : value.map(rel => {
                        if (rel.user1_id._id === url.userId) {
                            return rel.user2_id
                        } else {
                            return rel.user1_id
                        } 
                    })
                    setFriends(arr)
                })
        }
    }
    const fetchPosts = useCallback(() => {
        if (fetching.current) return
        fetching.current = true
        getPosts(token, { limit: posts.length === 0 ? 5 : 2, skip: posts.length === 0 ? 0 : posts.length + 1, user_id: url.userId, isInTrash: false }).then((value) => {
            if(value){
                setPosts(prev => [...prev, ...value])
                fetching.current = false
            }
        })
    }, [posts.length, token, url.userId])

    const handleScroll: UIEventHandler = (e) => {
        let target = e.target as HTMLElement
        if (location.pathname[location.pathname.length - 1] === '/' && target.scrollHeight - 20 <= target.scrollTop + target.clientHeight) {
            fetchPosts()
        }
    }

    useEffect(() => {
        fetchData()
        fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url.userId])

    if (!user) {
        return <></>
    }

    return (
        <main onScroll={handleScroll}>
            <Header user={user} friends={friends} />
            <Routes>
                <Route path="/" element={<Main {...user} friends={friends} posts={posts} setPosts={setPosts} />} />
                <Route path="/friends" element={<Friend friends={friends} />} />
                <Route path="/about/*" element={<About {...user} fetchData={fetchData} />} />
                <Route path="/photos" element={<Media />} />
            </Routes>
        </main>
    )
}
