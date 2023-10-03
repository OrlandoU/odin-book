import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import LeftBar from "../LeftBar";
import Section from "../../Section";
import Post from '../../Post/Post'
import { getPostsWithPhotos } from "../../../functions/posts";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import { NavLink, Params, useParams } from "react-router-dom";
import { getUserInfo } from "../../../functions/user";
import { MediaPosts } from "./Media";
import User from "../../../interfaces/User";
import PostI from "../../../interfaces/Post";

interface Props {
    friends: User[],
    posts: Post[],
    setPosts: Dispatch<SetStateAction<PostI[]>>
}

export default function Main(props: Props): JSX.Element {
    const url: Readonly<Params<string>> = useParams()
    const { token } = useContext(TokenContext) as Token

    const [user, setUser] = useState<User>()
    const [photos, setPhotos] = useState<MediaPosts[]>([])

    useEffect(() => {
        if (url.userId) {
            getUserInfo(token, url.userId)
                .then(value => value && setUser(value))

            getPostsWithPhotos(token, url.userId)
                .then(value => {
                    if (value) {
                        const arr: MediaPosts[] = value.flatMap(post => {
                            if (post.multiple_media.length > 0) {
                                return post.multiple_media.map(media => { return { media: media, id: post._id, user_id: post.user_id } })
                            } else {
                                return { media: post.media, id: post._id, user_id: post.user_id }
                            }
                        })
                        setPhotos(arr.slice(0, 9) || [])
                    }
                })
        }
    }, [url.userId])


    if (!user) {
        return <></>
    }

    return (
        <div className="user-data">
            <LeftBar>
                <Section title={'Intro'}>
                    {user && typeof user.jobs[0] !== 'string' && user.jobs.map(job => {
                        if (typeof job !== 'string') {
                            return (
                                <div className="intro-section">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>briefcase-variant</title><path d="M10 16V15H3L3 19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V15H14V16H10M20 7H16V5L14 3H10L8 5V7H4C2.9 7 2 7.9 2 9V12C2 13.11 2.89 14 4 14H10V12H14V14H20C21.1 14 22 13.1 22 12V9C22 7.9 21.1 7 20 7M14 7H10V5H14V7Z" /></svg>
                                    <span>{job.position ? <strong>{job.position}</strong> : job.is_current ? 'Works' : 'Worked'} at <strong>{job.company}</strong></span>
                                </div>
                            )
                        }
                        return <></>
                    }
                    )}
                    {user.academics.map(academic => {
                        if (typeof academic !== 'string') {
                            return (
                                <div className="intro-section">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>school</title><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
                                    <span>{academic.is_current ? 'Studies' : 'Studied'} at <strong>{academic.school}</strong></span>
                                </div>
                            )
                        }
                        return <></>
                    })}
                    {user.current_place && <div className="intro-section">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>home-variant</title><path d="M12,3L20,9V21H15V14H9V21H4V9L12,3Z" /></svg>
                        <span>Lives in <strong>{user.current_place}</strong></span>
                    </div>}
                    {user.birth_place && <div className="intro-section">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>map-marker</title><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>
                        <span>From <strong>{user.birth_place}</strong></span>
                    </div>}
                </Section>
                <Section title={'Photos'}>
                    {photos.length > 0 && <div className="photos-container">
                        {photos.map(photo =>
                            <NavLink to={'/photo/' + photo._id}>
                                <img src={photo.media} alt="User profile" />
                            </NavLink>
                        )}
                    </div>}
                </Section>
                <Section title={'Friends'}>
                    {props.friends.length > 0 &&
                        <>
                            <div className="post-data">
                                {props.friends.length} {props.friends.length > 1 ? 'Friends' : 'Friend'}
                            </div>
                            <div className="user-friends-container">
                                {props.friends.map(friend =>
                                    <NavLink to={'/' + friend._id + '/'}>
                                        <img src={friend.profile} alt="Friend profile" />
                                        <span>{friend.first_name} {friend.last_name}</span>
                                    </NavLink>
                                )}
                            </div>
                        </>
                    }
                </Section>
            </LeftBar>
            <div className="posts-container">
                {props.posts.map(post =>
                    <Post {...post} key={post._id} setPosts={props.setPosts} />
                )}
            </div>
        </div>
    )
}