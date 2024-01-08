/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { createReaction, deleteReaction, getCommentsCount, getCommentsUnderPost, getPostFormatted, getReactions } from "../../functions/posts";
import { Token, TokenContext } from "../../contexts/TokenContext";
import { UserContext } from "../../contexts/UserContext";
import { NavLink } from "react-router-dom";
import parse from 'html-react-parser'
import CommentForm from "./CommentForm";
import CommentC from "./Comment";

import angry from '../../assets/images/angry.svg'
import care from '../../assets/images/care.svg'
import haha from '../../assets/images/haha.svg'
import like from '../../assets/images/like.svg'
import love from '../../assets/images/love.svg'
import sad from '../../assets/images/sad.svg'
import wow from '../../assets/images/wow.svg'
import { SocketContext } from "../../contexts/SocketContext";
import User from "../../interfaces/User";
import { Socket } from "socket.io-client";
import Reaction from "../../interfaces/Reaction";
import Post from "../../interfaces/Post";
import Comment from "../../interfaces/Comment";

interface Props extends Post {
    fetchReactions?: () => void,
    isPhoto?: boolean,
    isExpanded?: boolean
}

export default function PostModal(props: Props): JSX.Element {
    const docRef = useRef<HTMLDivElement>(null)

    const user = useContext(UserContext) as User
    const { token } = useContext(TokenContext) as Token
    const socket = useContext(SocketContext) as Socket

    const [postReaction, setPostReaction] = useState<string>()
    const reactionsImgs: {[key: string]: string} = { angry, care, haha, like, love, sad, wow }

    const [end, setEnd] = useState<boolean>(false)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentsCounts, setCommentsCount] = useState<number>(0)
    const [reactions, setReactions] = useState<Reaction[]>([])
    const [reactionsFiltered, setReactionsFiltered] = useState<string[]>([])
    const [isOnline, setIsOnline] = useState<boolean>((typeof props.user_id !== 'string' && !!props.user_id) && props.user_id.isOnline)

    const handleReaction = async (): Promise<void> => {
        if (postReaction) {
            setPostReaction(undefined)
            setReactions(prev => prev.filter(reaction => typeof reaction.user_id !== 'string' && reaction.user_id._id !== user._id))
            await deleteReaction(token, props._id)
        } else {
            setPostReaction('like')
            if (typeof props.user_id === 'string') return
            const res = await createReaction(token, props._id, 'like', 'post', props.user_id!._id)
            if (res) setReactions(prev => [res, ...prev])
        }
    }
    const handleOddReaction = async (type: string): Promise<void> => {
        setPostReaction(type)
        if (typeof props.user_id === 'string') return
        const res = await createReaction(token, props._id, type, 'post', props.user_id!._id)
        if (res) {
            setReactions(prev => {
                let arr = prev.filter(reaction => typeof reaction.user_id !== 'string' && reaction.user_id._id !== user._id)
                return [res, ...arr]
            })
        }
    }

    const handleScroll = (): void => {
        if (docRef.current) {
            let scrollTop = docRef.current.scrollTop
            let scrollHeight = docRef.current.scrollHeight
            if (scrollTop + 722 >= scrollHeight) {
                setEnd(true)
            } else {
                setEnd(false)
            }
        }
    }

    useEffect(() => {
        getCommentsCount(token, props._id).then(value => {
            value && setCommentsCount(value)
        })
        getCommentsUnderPost(token, props._id).then((value) => {
            value && setComments(value)
        })
        handleScroll()
    }, [])

    useEffect(() => {
        getReactions(token, props._id).then(value => {
            if (!value) return
            setReactions(value)
            const myReaction = value.find((el) => typeof el.user_id !== 'string' && el.user_id._id === user._id)
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
        const handleUserChangeStatus = (user: User) => {
            if (typeof props.user_id !== 'string' && user._id === props.user_id!._id) {
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
                        {props.user_id && typeof props.user_id !== 'string' && <img src={props.user_id.profile} alt={props.user_id.first_name + ' ' + props.user_id.first_name} className="img-profile" />}
                        {isOnline &&
                            <div className="user-online"></div>
                        }
                    </div>
                    <div className="post-subheader">
                        <div className="post-type-name">
                            {props.user_id && typeof props.user_id !== 'string' && <NavLink className="post-name" to={'/' + props.user_id._id}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>}
                            <div className="post-data extra">{props.type === 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type === 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}</div>
                            {props.type === 'group-create' && props.group && typeof props.group !== 'string' && <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>}
                        </div>
                        <div className="post-data">{props.create_date && getPostFormatted(props.create_date)}</div>
                    </div>
                </div>
                {props.content && <div className="post-content">
                    {parse(String(parse(props.content)))}
                </div>}
                {!props.isPhoto && props.media && props.type !== 'profile' &&
                    <NavLink to={'/photo/' + props._id} className="post-media" style={{ marginTop: props.content ? '' : '8px' }}>
                        <img src={props.media} alt="Post media" />
                    </NavLink>}
                {!props.isPhoto && props.multiple_media && props.multiple_media.length > 0 &&
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
                                {reactions.length > 1 ? reactions.length : typeof reactions[0].user_id !== 'string' && reactions[0].user_id.first_name + ' ' + reactions[0].user_id.last_name}
                            </div>}                        {commentsCounts > 0 && <span className="post-comments-count">{commentsCounts} {commentsCounts > 1 ? 'Comments' : 'Comment'}</span>}
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
                        <div className="post-button">
                            <div className="post-button-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>message-outline</title><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M20 16H5.2L4 17.2V4H20V16Z" /></svg>
                            </div>
                            <div className="post-button-text">Comment</div>
                        </div>
                    </div>
                </div>
                {props.isExpanded && <CommentForm post={props._id} end={true} />}
                {comments.map((comment: Comment) =>
                    <CommentC {...comment} />
                )}
            </div>
            {!props.isExpanded && <CommentForm post={props._id} end={end} />}
        </>
    )
}