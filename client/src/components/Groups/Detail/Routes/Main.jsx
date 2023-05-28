import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LeftBar from "../LeftBar";
import Section from "../../../Section";
import Post from '../../../Post/Post'
import { getPosts } from "../../../../functions/posts";
import { TokenContext } from "../../../../contexts/TokenContext";
import { useParams } from "react-router-dom";
import PostForm from '../../../Post/PostForm'

export default function Main(props) {
    const url = useParams()
    const fetching = useRef()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    const fetchPosts = useCallback((length, id) => {
        if(length) return 
        if (fetching.current) return

        fetching.current = true
        getPosts(token, { group: id, limit: length === 0 ? 3 : 2, skip: length === 0 ? 0 : length + 1 })
            .then(value => {
                setPosts(prev => [...prev, ...value])
                fetching.current = false
            })
    }, [token])

    const handleScroll = useCallback((e) => {
        if (e.target.scrollHeight - 20 <= e.target.scrollTop + e.target.clientHeight) {
            fetchPosts(posts.length, url.groupId)
        }
    }, [posts.length, url.groupId, fetchPosts])

    useEffect(() => {
        fetchPosts(0, url.groupId)
    }, [])

    useEffect(() => {
        document.querySelector('.groups-main main').addEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <div className="user-data">
            <div className="posts-container">
                <PostForm group={props} />
                {posts.map(post =>
                    <Post {...post} key={post._id} />
                )}
            </div>
            <LeftBar>
                <Section title={'About'} className={'main-group-about'}>
                    <div className="main-group-about-data">
                        <div className="main-group-about-icon">
                            {props.privacy === 'private' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>lock</title><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>earth</title><path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>}
                        </div>
                        <div className="main-group-about-info">
                            <h2 className="main-group-about-title">{props.privacy}</h2>
                            <span>{props.privacy === 'private' ? 'Only members' : 'Anyone'} can see who's in the group and what they post.</span>
                        </div>
                    </div>

                    <div className="main-group-about-data">
                        <div className="main-group-about-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye</title><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" /></svg>
                        </div>
                        <div className="main-group-about-info">
                            <h2 className="main-group-about-title">Visible</h2>
                            <span>Anyone can find this group.</span>
                        </div>
                    </div>

                </Section>
            </LeftBar>
        </div>
    )
}