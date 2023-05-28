import { useContext, useEffect, useRef, useState } from "react";
import { createReaction, deleteReaction, getCommentsCount, getCommentsUnderPost, getPostFormatted, getReactions } from "../../functions/posts";
import { TokenContext } from "../../contexts/TokenContext";
import { UserContext } from "../../contexts/UserContext";
import { NavLink } from "react-router-dom";
import parse from 'html-react-parser'
import Modal from "../Modal";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

import angry from '../../assets/images/angry.svg'
import care from '../../assets/images/care.svg'
import haha from '../../assets/images/haha.svg'
import like from '../../assets/images/like.svg'
import love from '../../assets/images/love.svg'
import sad from '../../assets/images/sad.svg'
import wow from '../../assets/images/wow.svg'
import { SocketContext } from "../../contexts/SocketContext";

export default function PostModal(props) {
    const docRef = useRef()

    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)
    const socket = useContext(SocketContext)

    const [postReaction, setPostReaction] = useState()
    const reactionsImgs = { angry, care, haha, like, love, sad, wow }

    const [end, setEnd] = useState(false)
    const [comments, setComments] = useState([])
    const [commentsCounts, setCommentsCount] = useState()
    const [reactions, setReactions] = useState([])
    const [reactionsFiltered, setReactionsFiltered] = useState([])
    const [isOnline, setIsOnline] = useState(props.user_id.isOnline)

    const handleReaction = async () => {
        if (postReaction) {
            setPostReaction(null)
            setReactions(prev => prev.filter(reaction => reaction.user_id._id !== user._id))
            await deleteReaction(token, props._id)
        } else {
            setPostReaction('like')
            const res = await createReaction(token, props._id, 'like', 'post', props.user_id._id)
            setReactions(prev => [res, ...prev])
        }
    }
    const handleOddReaction = async (type) => {
        setPostReaction(type)
        const res = await createReaction(token, props._id, type, 'post', props.user_id._id)
        setReactions(prev => {
            let arr = prev.filter(reaction => reaction.user_id._id !== user._id)
            return [res, ...arr]
        })
    }

    const handleScroll = () => {
        let scrollTop = docRef.current.scrollTop
        let scrollHeight = docRef.current.scrollHeight
        if (scrollTop + 722 >= scrollHeight) {
            setEnd(true)
        } else {
            setEnd(false)
        }
    }

    useEffect(() => {
        getCommentsCount(token, props._id).then(value => {
            setCommentsCount(value)
        })
        getCommentsUnderPost(token, props._id).then(value => {
            setComments(value)
        })
        handleScroll()
    }, [])

    useEffect(() => {
        getReactions(token, props._id).then(value => {
            setReactions(value)
            const myReaction = value.find((el) => el.user_id._id === user._id)
            if (myReaction) {
                setPostReaction(myReaction.type)
            }
        })
    }, [user])

    useEffect(() => {
        if (props.fetchReactions) {
            props.fetchReactions()
        }
        let arr = reactions.map(reaction => reaction.type)
        setReactionsFiltered([...new Set(arr)])
    }, [reactions])

    useEffect(() => {
        const handleUserChangeStatus = (user) => {
            if (user._id === props.user_id._id) {
                setIsOnline(user.isOnline)
            }
        }
        socket.on('user_status', handleUserChangeStatus)
        return () => {
            socket.off('user_status', handleUserChangeStatus)
        }
    }, [socket, props.user_id])

    return (
        <>
            <div className="post" ref={docRef} onScroll={handleScroll}>
                <div className="post-header">
                    <div className="post-user">
                        <img src={props.user_id.profile} alt={props.user_id.first_name + ' ' + props.user_id.first_name} className="img-profile" />
                        {isOnline &&
                            <div className="user-online"></div>
                        }
                    </div>
                    <div className="post-subheader">
                        <div className="post-type-name">
                            <NavLink className="post-name" to={'/' + props.user_id._id}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>
                            <div className="post-data extra">{props.type == 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type == 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}</div>
                            {props.type === 'group-create' && <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>}
                        </div>
                        <div className="post-data">{getPostFormatted(props.create_date)}</div>
                    </div>
                </div>
                {props.content && <div className="post-content">
                    {parse(parse(props.content))}
                </div>}
                {!props.isPhoto && props.media && props.type !== 'profile' &&
                    <NavLink to={'/photo/' + props._id} className="post-media" style={{ marginTop: props.content ? '' : '8px' }}>
                        <img src={props.media} alt="Post media" />
                    </NavLink>}
                {!props.isPhoto && props.multiple_media.length > 0 &&
                    <NavLink to={'/photo/' + props._id} className={"post-create-images main-post length" + props.multiple_media.length} style={{ marginTop: props.content ? '' : '8px' }}>
                        {props.multiple_media.map(media =>
                            <img src={media} alt="" />
                        )}
                    </NavLink>}
                {props.type === 'profile' &&
                    <NavLink to={'/photo/' + props._id} className="post-media-profile" style={{ marginTop: props.content ? '' : '8px' }}>
                        <div className="post-banner">

                        </div>
                        <img src={props.media} alt="" />
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
                                {reactions.length > 1 ? reactions.length : reactions[0].user_id.first_name + ' ' + reactions[0].user_id.last_name}
                            </div>}                        {commentsCounts > 0 && <span className="post-comments-count">{commentsCounts} {commentsCounts > 1 ? 'Comments' : 'Comment'}</span>}
                    </div>}
                    <div className="post-options">
                        <div className={"post-button relative " + postReaction} onClick={() => handleReaction('like')}>
                            {!postReaction ?
                                <>
                                    <div className="post-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>thumb-up-outline</title><path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" /></svg>
                                    </div>
                                    <div className="post-button-text">{postReaction ? postReaction.type : 'Like'}</div>
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
                        <div className="post-button">
                            <div className="post-button-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>message-outline</title><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" /></svg>
                            </div>
                            <div className="post-button-text">Comment</div>
                        </div>
                    </div>
                </div>
                {props.isExpanded && <CommentForm post={props._id} end={true} />}
                {comments.map(comment =>
                    <Comment {...comment} />
                )}
            </div>
            {!props.isExpanded && <CommentForm post={props._id} end={end} />}
        </>
    )
}