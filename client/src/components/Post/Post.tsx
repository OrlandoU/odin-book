/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { createReaction, deleteReaction, getCommentsCount, getPostFormatted, getReactions, updatePost } from "../../functions/posts";
import { Token, TokenContext } from "../../contexts/TokenContext";
import { UserContext } from "../../contexts/UserContext";
import { NavLink, useParams } from "react-router-dom";
import parse from 'html-react-parser'
import Modal from "../Modal";
import PostModal from "./PostModal";

import angry from '../../assets/images/angry.svg'
import care from '../../assets/images/care.svg'
import haha from '../../assets/images/haha.svg'
import like from '../../assets/images/like.svg'
import love from '../../assets/images/love.svg'
import sad from '../../assets/images/sad.svg'
import wow from '../../assets/images/wow.svg'
import HiddenMenu from "../HiddenMenu";
import { acceptFriendRequest, getRelationship, removeFriend, sendFriendRequest } from "../../functions/relationship";
import { SocketContext } from "../../contexts/SocketContext";
import PostI from "../../interfaces/Post";
import User from "../../interfaces/User";
import { Socket } from "socket.io-client";
import Relationship, { RelationshipUser } from "../../interfaces/Relationship";
import Reaction from "../../interfaces/Reaction";


export default function Post(props: PostI): JSX.Element {
    const url = useParams()

    const socket = useContext(SocketContext) as Socket
    const user = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token

    const [post, setPost] = useState<PostI>(props)
    const [relation, setRelation] = useState<RelationshipUser>()
    const [postReaction, setPostReaction] = useState<string>()
    const reactionsImgs: {[key: string]: string} = { angry, care, haha, like, love, sad, wow }

    const [commentsCounts, setCommentsCount] = useState<number>(0)
    const [reactions, setReactions] = useState<Reaction[]>([])
    const [reactionsFiltered, setReactionsFiltered] = useState<string[]>([])
    const [isOnline, setIsOnline] = useState(post.user_id && typeof post.user_id !== 'string' ? post.user_id.isOnline : false)

    const handleReaction = async () => {
        if (postReaction) {
            setPostReaction(undefined)
            setReactions(prev => prev.filter(reaction => typeof reaction.user_id !== 'string' && reaction.user_id._id !== user._id))
            await deleteReaction(token, post._id)
        } else if(post.user_id && typeof post.user_id !== 'string'){
            setPostReaction('like')
            const res = await createReaction(token, post._id, 'like', 'post', post.user_id._id)
            res && setReactions(prev => [res, ...prev])
        }
    }

    const handleOddReaction = async (type: string) => {
        if(!post.user_id || typeof post.user_id === 'string') return
        setPostReaction(type)
        const res = await createReaction(token, post._id, type, 'post', post.user_id._id)
        res && setReactions(prev => {
            let arr = prev.filter(reaction => typeof reaction.user_id !== 'string' && reaction.user_id._id !== user._id)
            return [res, ...arr]
        })
    }

    const handleClick = () => {
        const element = document.getElementById('post' + post._id)
        element && element.click()
    }

    const fetchReactions = () => {
        getReactions(token, post._id).then(value => {
            if(!value) return
            setReactions(value)
            const myReaction = value.find((el) => typeof el.user_id !== 'string' && el.user_id._id === user._id)
            if (myReaction) {
                setPostReaction(myReaction.type)
            }
        })
    }

    const fetchRelation = () => {
        if (typeof post.user_id !== 'string' && post.user_id!._id !== user._id) {
            getRelationship(token, post.user_id!._id).then(value => {
                if (!value) {
                    return setRelation(undefined)
                }
                typeof value.user1_id !== 'string' && typeof value.user2_id !== 'string'  && setRelation(value.user1_id._id === user._id ? { ...value.user2_id, ...value } : { ...value.user1_id, ...value})
            })
        }
    }

    const handleSendFriendRequest = () => {
        typeof post.user_id !== 'string' && sendFriendRequest(token, post.user_id!._id)
            .then(res => res && typeof res.user1_id !== 'string' && typeof res.user2_id !== 'string'  && setRelation(res.user1_id._id === user._id ? { ...res.user2_id, ...res} : { ...res.user1_id, ...res}))
    }

    const handleRemoveRequest = () => {
        typeof post.user_id !== 'string' && removeFriend(token, post.user_id!._id)
            .then(res => setRelation(undefined))
    }

    const handleSavePost = () => {
        updatePost(token, post._id, { save: true, _id: post._id })
            .then(res => res && setPost(res))
    }

    const handleUnsavePost = () => {
        updatePost(token, post._id, { unsave: true, _id: post._id })
            .then(res => res && setPost(res))
    }

    const handleRemovePost = () => {
        updatePost(token, post._id, { isInTrash: true, _id: post._id })
            .then(res => res && setPost(res))
    }

    const handleAcceptRequest = () => {
        typeof post.user_id !== 'string' && acceptFriendRequest(token, post.user_id!._id)
            .then(res => res && typeof res.user1_id !== 'string' && typeof res.user2_id !== 'string' &&  setRelation(res.user1_id._id === user._id ? { ...res.user2_id, ...res } : { ...res.user1_id, ...res }))
    }

    useEffect(() => {
        getCommentsCount(token, post._id).then(value => {
            value && setCommentsCount(value)
        })
    }, [])

    useEffect(() => {
        fetchReactions()
    }, [user])

    useEffect(() => {
        let arr = reactions.map(reaction => reaction.type)
        setReactionsFiltered([...new Set(arr)])
    }, [reactions])

    useEffect(() => {
        const handleUserChangeStatus = (user: User) => {
            if (typeof props.user_id !== 'string' && user._id === props.user_id!._id) {
                setIsOnline(user.isOnline)
            }
        }
        socket.on('user_status', handleUserChangeStatus)
        return () => {
            socket.off('user_status', handleUserChangeStatus)
        }
    }, [socket, post.user_id])

    if (typeof post.user_id === 'string' || !post.user_id || !user) return <></>

    return (
        <div className="post">
            <div className="post-header">
                <div className={!(post.group && !url.groupId) ? "post-user" : "post-user group"}>
                    {(post.group && !url.groupId) ?
                        <>
                            <div className="group-post">
                                {typeof post.group !== 'string' && <img src={post.group.cover} alt="" />}
                            </div>
                            <div className="group-post-user">
                                <img src={post.user_id.profile} alt="" className="img-profile" />
                                {isOnline &&
                                    <div className="user-online"></div>
                                }
                            </div>
                        </> :
                        <>
                            {post.user_id.profile && <img src={post.user_id.profile} alt="" className="img-profile" />}
                            {isOnline &&
                                <div className="user-online"></div>
                            }
                        </>
                    }

                </div>
                {/* {post.type === 'normal' ? */
                    <div className="post-subheader">
                        {(post.group && !url.groupId) ?
                            <>
                                <div className="post-type-name">
                                    {typeof post.group !== 'string' && <NavLink to={'/groups/' + post.group._id} className={'post-name'} style={{ display: 'inline' }}>
                                        {post.group.name}
                                    </NavLink>}
                                    <div className="post-data extra">
                                        {post.type === 'group-create' ? ' created the group' : post.type === 'group-cover' ? ' updated the group cover photo.' : post.type === 'profile' ? ' updated his profile picture.' : post.type === 'cover' ? ' updated his profile cover' : ''}
                                    </div>
                                </div>
                                <div className="post-data group">
                                    <NavLink to={'/' + post.user_id._id + '/'}>{post.user_id.first_name} {post.user_id.last_name}</NavLink>  · {post.create_date && getPostFormatted(post.create_date)}
                                </div>
                            </> :
                            <>
                                <div className="post-type-name">
                                    <NavLink style={{ display: 'inline' }} className="post-name" to={'/' + post.user_id._id + '/'}>{post.user_id.first_name} {post.user_id.last_name}</NavLink>
                                    <div className="post-data extra">
                                        {post.type === 'group-create' ? ' created the group' : post.type === 'group-cover' ? ' updated the group cover photo.' : post.type === 'profile' ? ' updated his profile picture.' : post.type === 'cover' ? ' updated his profile cover' : ''}
                                    </div>
                                    {post.type === 'group-create' && post.group && typeof post.group !== 'string' && <NavLink className="post-name" to={'/groups/' + post.group._id}>{post.group.name}</NavLink>}
                                </div>
                                {post.create_date && <div className="post-data">{getPostFormatted(post.create_date)}</div>}
                            </>
                        }
                    </div> 
                    // :
                    // <div className="post-subheader">
                    //     <>
                    //         <div className="post-type-name">
                    //             <NavLink style={{ display: 'inline' }} className="post-name" to={'/' + post.user_id._id + '/'}>{post.user_id.first_name} {post.user_id.last_name}</NavLink>
                    //             <div className="post-data extra">
                    //                 {post.type === 'group-create' ? ' created the group ' : post.type === 'group-cover' ? ' updated the group cover photo.' : post.type === 'profile' ? ' updated his profile picture.' : post.type === 'cover' ? ' updated his profile cover.' : ''}
                    //             </div>
                    //             {post.type === 'group-create' && <NavLink className="post-name" to={'/groups/' + post.group._id}>{post.group.name}</NavLink>}
                    //         </div>
                    //         {post.create_date && <div className="post-data">{getPostFormatted(post.create_date)}</div>}
                    //     </>
                    // </div>
                }
                <HiddenMenu className={'post-hidden-menu'} onVisible={fetchRelation}>
                    {post.saved && post.saved.includes(user._id) &&
                        <span onClick={handleUnsavePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark-off-outline</title><path d="M3.28,4L2,5.27L5,8.27V21L12,18L16.78,20.05L18.73,22L20,20.72L3.28,4M7,18V10.27L13,16.25L12,15.82L7,18M7,5.16L5.5,3.67C5.88,3.26 6.41,3 7,3H17A2,2 0 0,1 19,5V17.16L17,15.16V5H7V5.16Z" /></svg>
                            Unsave post
                        </span>}
                    {((post.saved && !post.saved.includes(user._id)) || !post.saved) &&
                        <span onClick={handleSavePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark post</title><path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" /></svg>
                            Save post
                        </span>}
                    {post.user_id && relation && (post.user_id._id !== user._id || relation._id) &&
                        <>
                            <div className="border-line"></div>
                            {relation.request_state === 'Accepted' &&
                                <span style={{ textTransform: 'capitalize' }} onClick={handleRemoveRequest}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-remove</title><path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" /></svg>
                                    Unfriend {relation.first_name}
                                </span>
                            }
                            {
                                relation.request_state === 'Pending' && relation.sender_id !== user._id &&
                                <span style={{ textTransform: 'capitalize' }} onClick={handleAcceptRequest}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-check</title><path d="M21.1,12.5L22.5,13.91L15.97,20.5L12.5,17L13.9,15.59L15.97,17.67L21.1,12.5M10,17L13,20H3V18C3,15.79 6.58,14 11,14L12.89,14.11L10,17M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4Z" /></svg>
                                    Accept Friend Request
                                </span>
                            }
                            {
                                relation.request_state === 'Pending' && relation.sender_id === user._id &&
                                <span style={{ textTransform: 'capitalize' }} onClick={handleRemoveRequest}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-remove</title><path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" /></svg>
                                    Cancel Friend Request
                                </span>
                            }
                            {!relation._id &&
                                <span style={{ textTransform: 'capitalize' }} onClick={handleSendFriendRequest}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-arrow-right</title><path d="M18 16H14V18H18V20L21 17L18 14V16M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14" /></svg>
                                    Send Friend Request
                                </span>
                            }
                        </>
                    }
                    {post.user_id._id === user._id &&
                        <>
                            <div className="border-line"></div>
                            <span onClick={handleRemovePost}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>remove post</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>
                                Move to thrash
                            </span>
                        </>
                    }
                </HiddenMenu>
            </div>
            {post.content && <div className="post-content">
                {parse(String(parse(post.content)))}
            </div>}
            {post.media && post.type !== 'profile' &&
                <NavLink to={'/photo/' + post._id} className="post-media" style={{ marginTop: post.content ? '' : '8px' }}>
                    <img src={post.media} alt="Post media" />
                </NavLink>}
            {post.multiple_media && post.multiple_media.length > 0 &&
                <div className={"post-create-images main-post length" + post.multiple_media.length} style={{ marginTop: post.content ? '' : '8px' }}>
                    {post.multiple_media.map((media, index) =>
                        <NavLink to={`/photo/${post._id}/${index}`} >
                            <img src={media} alt="" key={index}/>
                        </NavLink>)
                    }
                </div>
            }
            {post.type === 'profile' &&
                <NavLink to={'/photo/' + post._id} className="post-media-profile" style={{ marginTop: post.content ? '' : '8px' }}>
                    <div className="post-banner">
                        {post.user_id.cover && <img src={post.user_id.cover} alt="Post user banner" />}
                    </div>
                    <img src={post.media} alt="" />
                </NavLink>
            }
            <div className="post-reactions">
                {(reactions.length > 0 || commentsCounts > 0) && <div className="post-counts">
                    {reactions.length > 0 &&
                        <div className="post-reactions-counter">
                            <div className="post-reactions-imgs">
                                {reactionsFiltered.map(reaction =>
                                    <img src={reactionsImgs[reaction]} alt="Reaction" />
                                )}
                            </div>
                            {reactions.length > 2 ? reactions.length : reactions.slice(0, 2).map(reaction => typeof reaction.user_id !== 'string' && reaction.user_id._id === user._id ? 'You' : typeof reaction.user_id !== 'string' && reaction.user_id.first_name + ' ' + reaction.user_id.last_name).join(' and ')}
                        </div>}
                    {commentsCounts > 0 && <span className="post-comments-count" onClick={handleClick}>{commentsCounts} {commentsCounts > 1 ? 'Comments' : 'Comment'}</span>}
                </div>}
                <div className="post-options">
                    <div className={"post-button relative " + postReaction} onClick={() => handleReaction()}>
                        {!postReaction ?
                            <>
                                <div className="post-button-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>thumb-up-outline</title><path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" /></svg>
                                </div>
                                <div className="post-button-text">{postReaction ? postReaction : 'Like'}</div>
                            </> :
                            <>
                                <div className="post-button-icon">
                                    <img src={reactionsImgs[postReaction]} alt="" />
                                </div>
                                <div className="post-button-text ">{postReaction}</div>
                            </>
                        }
                    </div>
                    <div className="post-reactions-options">
                        {Object.entries(reactionsImgs).map(reaction =>
                            <img src={reaction[1]} alt="" onClick={() => handleOddReaction(reaction[0])} />
                        )}
                    </div>
                    <Modal
                        postId={post._id}
                        title={post.user_id.first_name + ' ' + post.user_id.last_name}
                        modalClass={'post-modal-container'}
                        trigger={
                            <div className="post-button">
                                <div className="post-button-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>message-outline</title><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" /></svg>
                                </div>
                                <div className="post-button-text">Comment</div>
                            </div>}>
                        <PostModal {...props} fetchReactions={fetchReactions} />
                    </Modal>
                </div>
            </div>
        </div>
    )
}