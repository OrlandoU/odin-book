import { Route, Routes, useLocation, useParams } from "react-router-dom"
import '../../assets/styles/User.css'
import Header from "./Header"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { getUserInfo } from "../../functions/user"
import { TokenContext } from "../../contexts/TokenContext"
import Main from "./Routes/Main"
import About from "./Routes/About"
import { getFriends } from "../../functions/relationship"
import Media from "./Routes/Media"
import Friend from "./Routes/Friend"
import { getPosts } from "../../functions/posts"

export default function User() {
    const location = useLocation()
    const fetching = useRef()
    const url = useParams()
    const { token } = useContext(TokenContext)

    const [posts, setPosts] = useState([])
    const [user, setUser] = useState({})
    const [friends, setFriends] = useState([])

    const fetchData = () =>{
        getUserInfo(token, url.userId).then(value => {
            if (value) {
                setUser(value)
            }
        })

        getFriends(token, url.userId)
            .then(value => {
                const arr = value.map(rel => {
                    if (rel.user1_id._id === url.userId) {
                        return rel.user2_id
                    } else {
                        return rel.user1_id
                    }
                })
                setFriends(arr)
            })
    }
    const fetchPosts = useCallback(() => {
        if (fetching.current) return
        fetching.current = true
        getPosts(token, { limit: posts.length === 0 ? 5 : 2, skip: posts.length === 0 ? 0 : posts.length + 1, user_id: url.userId, isInTrash: false }).then((value) => {
            setPosts(prev => [...prev, ...value])
            fetching.current = false
        })
    }, [posts.length, token, url.userId])

    const handleScroll = (e) => {
        if (location.pathname[location.pathname.length - 1] === '/' && e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
            fetchPosts()
        }
    }

    useEffect(() => {
        fetchData()
        fetchPosts()
    }, [url.userId])

    if (!user) {
        return null
    }

    return (
        <main onScroll={handleScroll}>
            <Header {...user} friends={friends}/>
            <Routes>
                <Route path="/" element={<Main {...user} friends={friends} posts={posts} setPosts={setPosts}/>} />
                <Route path="/friends" element={<Friend friends={friends}/>}/>
                <Route path="/about/*" element={<About {...user} fetchData={fetchData}/>} />
                <Route path="/photos" element={<Media />}/>
            </Routes>
        </main>
    )
}
