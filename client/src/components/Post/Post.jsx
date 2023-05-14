import { useContext, useEffect, useState } from "react";
import { createReaction, deleteReaction, getCommentsCount, getPostFormatted, getReactions } from "../../functions/posts";
import { TokenContext } from "../../contexts/TokenContext";
import { UserContext } from "../../contexts/UserContext";
import { NavLink } from "react-router-dom";
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


export default function Post(props) {
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)
    const [postReaction, setPostReaction] = useState()
    const reactionsImgs = { angry, care, haha, like, love, sad, wow }

    const [commentsCounts, setCommentsCount] = useState()
    const [reactions, setReactions] = useState([])
    const [reactionsFiltered, setReactionsFiltered] = useState([])

    const handleReaction = async () => {
        if (postReaction) {
            setPostReaction(null)
            setReactions(prev => prev.filter(reaction => reaction.user_id._id !== user._id))
            await deleteReaction(token, props._id)
        } else {
            setPostReaction('like')
            const res = await createReaction(token, props._id)
            setReactions(prev => [res, ...prev])
        }
    }

    const handleOddReaction = async (type) => {
        setPostReaction(type)
        const res = await createReaction(token, props._id, type)
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

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-user">
                    <img src={props.user_id.profile} alt="" />
                </div>
                <div className="post-subheader">
                    <div className="post-type-name">
                        <NavLink className="post-name" to={'/' + props.user_id._id}>{props.user_id.first_name} {props.user_id.last_name}</NavLink>
                        <div className="post-data">{props.type == 'group-create' ? 'created the group' : props.type === 'group-cover' ? 'updated the group cover photo.' : props.type == 'profile' ? 'updated his profile picture.' : props.type === 'cover' ? 'updated his profile cover' : ''}</div>
                        {props.type === 'group-create' && <NavLink className="post-name" to={'/groups/' + props.group._id}>{props.group.name}</NavLink>}
                    </div>
                    <div className="post-data">{getPostFormatted(props.create_date)}</div>
                </div>
            </div>
            {props.content && <div className="post-content">
                {parse(parse(props.content))}
            </div>}
            {props.media && props.type !== 'profile' && <div className="post-media" style={{ marginTop: props.content ? '' : '8px' }}>
                <img src={props.media} alt="Post media" />
            </div>}
            {props.multiple_media.length > 0 &&
                <div className={"post-create-images main-post length" + props.multiple_media.length} style={{ marginTop: props.content ? '' : '8px' }}>
                    {props.multiple_media.map(media =>
                        <img src={media} alt="" />
                    )}
                </div>}
            {props.type === 'profile' &&
                <div className="post-media-profile" style={{ marginTop: props.content ? '' : '8px' }}>
                    <div className="post-banner">

                    </div>
                    <img src={props.media} alt="" />
                </div>
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
                        <PostModal {...props} fetchReactions={fetchReactions}/>
                    </Modal>
                </div>
            </div>
        </div>
    )
}