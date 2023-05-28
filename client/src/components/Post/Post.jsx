import { useContext, useEffect, useState } from "react";
import { createReaction, deletePost, deleteReaction, getCommentsCount, getPostFormatted, getReactions, trashPost } from "../../functions/posts";
import { TokenContext } from "../../contexts/TokenContext";
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
import { getRelationship } from "../../functions/relationship";
import { SocketContext } from "../../contexts/SocketContext";


export default function Post(props) {
    const url = useParams()

    const socket = useContext(SocketContext)
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)

    const [relation, setRelation] = useState({})
    const [postReaction, setPostReaction] = useState()
    const reactionsImgs = { angry, care, haha, like, love, sad, wow }

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

    const handleClick = () => {
        document.getElementById('post' + props._id).click()
    }

    const fetchReactions = () => {
        getReactions(token, props._id).then(value => {
            setReactions(value)
            const myReaction = value.find((el) => el.user_id._id === user._id)
            if (myReaction) {
                setPostReaction(myReaction.type)
            }
        })
    }

    const fetchRelation = () => {
        if (props.user_id._id !== user._id) {
            getRelationship(token, props.user_id._id).then(value => {
                setRelation(value.user1_id === user._id ? { ...value.user2_id, request_state: value.request_state } : { ...value.user1_id, request_state: value.request_state })
            })
        }
    }
    const handleRemovePost = () => {
        trashPost(token, props._id, true).then(value => {
            if (props.setPosts) {
                console.log(value)
                props.setPosts(prev => prev.filter(post => post._id !== value._id))
            }
        })
    }

    useEffect(() => {
        getCommentsCount(token, props._id).then(value => {
            setCommentsCount(value)
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
        <div className="post">
            <div className="post-header">
                <div className={!(props.group && !url.groupId) ? "post-user" : "post-user group"}>
                    {(props.group && !url.groupId) ?
                        <>
                            <div className="group-post">
                                <img src={props.group.cover} alt="" />
                            </div>
                            <div className="group-post-user">
                                <img src={props.user_id.profile} alt="" className="img-profile"/>
                                {isOnline &&
                                    <div className="user-online"></div>
                                }
                            </div>
                        </> :
                        <>
                            {props.user_id.profile && <img src={props.user_id.profile} alt="" className="img-profile" />}
                            {isOnline &&
                                <div className="user-online"></div>
                            }
                        </>
                    }

                </div>
                {props.type === 'normal' ?
                    <div className="post-subheader">
                        {(props.group && !url.groupId) ?
                            <>
                                <div className="post-type-name">
                                    <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>
                                    <div className="post-data extra">
                                        {props.type == 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type == 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}
                                    </div>
                                </div>
                                <div className="post-data group">
                                    <NavLink to={'/' + props.user_id._id + '/'}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>  · {getPostFormatted(props.create_date)}
                                </div>
                            </> :
                            <>
                                <div className="post-type-name">
                                    <NavLink className="post-name" to={'/' + props.user_id._id}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>
                                    <div className="post-data extra">
                                        {props.type == 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type == 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}
                                    </div>
                                    {props.type === 'group-create' && <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>}
                                </div>
                                <div className="post-data">{getPostFormatted(props.create_date)}</div>
                            </>
                        }
                    </div> :
                    <div className="post-subheader">
                        <>
                            <div className="post-type-name">
                                <NavLink className="post-name" to={'/' + props.user_id._id}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>
                                <div className="post-data extra">
                                    {props.type == 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type == 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}
                                </div>
                                {props.type === 'group-create' && <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>}
                            </div>
                            <div className="post-data">{getPostFormatted(props.create_date)}</div>
                        </>
                    </div>
                }
                <HiddenMenu className={'post-hidden-menu'} onVisible={fetchRelation}>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark post</title><path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" /></svg>
                        Save post
                    </span>
                    {(props.user_id._id !== user._id || relation._id) &&
                        <>
                            <div className="border-line"></div>
                            {relation.request_state === 'Accepted' &&
                                <span style={{ textTransform: 'capitalize' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-remove</title><path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" /></svg>
                                    Unfriend {relation.first_name}
                                </span>
                            }
                            {!relation._id &&
                                <span style={{ textTransform: 'capitalize' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-arrow-right</title><path d="M18 16H14V18H18V20L21 17L18 14V16M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14" /></svg>
                                    Send Friend Request
                                </span>
                            }
                        </>
                    }
                    {props.user_id._id === user._id &&
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
            {props.content && <div className="post-content">
                {parse(parse(props.content))}
            </div>}
            {props.media && props.type !== 'profile' &&
                <NavLink to={'/photo/' + props._id} className="post-media" style={{ marginTop: props.content ? '' : '8px' }}>
                    <img src={props.media} alt="Post media" />
                </NavLink>}
            {props.multiple_media && props.multiple_media.length > 0 &&
                <div className={"post-create-images main-post length" + props.multiple_media.length} style={{ marginTop: props.content ? '' : '8px' }}>
                    {props.multiple_media.map((media, index) =>
                        <NavLink to={`/photo/${props._id}/${index}`} >
                            <img src={media} alt="" />
                        </NavLink>)
                    }
                </div>
            }
            {props.type === 'profile' &&
                <NavLink to={'/photo/' + props._id} className="post-media-profile" style={{ marginTop: props.content ? '' : '8px' }}>
                    <div className="post-banner">
                        {props.user_id.cover && <img src={props.user_id.cover} alt="Post user banner" />}
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
                            {reactions.length > 2 ? reactions.length : reactions.slice(0, 2).map(reaction => reaction.user_id._id === user._id ? 'You' : reaction.user_id.first_name + ' ' + reaction.user_id.last_name).join(' and ')}
                        </div>}
                    {commentsCounts > 0 && <span className="post-comments-count" onClick={handleClick}>{commentsCounts} {commentsCounts > 1 ? 'Comments' : 'Comment'}</span>}
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
                    <Modal
                        postId={props._id}
                        title={props.user_id.first_name + ' ' + props.user_id.last_name}
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