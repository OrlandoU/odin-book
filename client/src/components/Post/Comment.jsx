import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { createReaction, deleteReaction, getCommentsUnderPost, getPostFormatted, getReactions } from "../../functions/posts";
import CommentForm from "./CommentForm";
import { TokenContext } from "../../contexts/TokenContext";
import parse from 'html-react-parser'
import { UserContext } from "../../contexts/UserContext";

import angry from '../../assets/images/angry.svg'
import care from '../../assets/images/care.svg'
import haha from '../../assets/images/haha.svg'
import like from '../../assets/images/like.svg'
import love from '../../assets/images/love.svg'
import sad from '../../assets/images/sad.svg'
import wow from '../../assets/images/wow.svg'


export default function Comment(props) {
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)
    const reactionImgs = { angry, care, haha, like, love, sad, wow }

    const [replies, setReplies] = useState([])
    const [repliesVisibility, setRepliesVisibility] = useState(false)
    const [commentReaction, setCommentReaction] = useState()

    const [reactionsFiltered, setReactionsFiltered] = useState([])
    const [reactions, setReactions] = useState([])


    const handleReaction = async () => {
        if (commentReaction) {
            setCommentReaction(null)
            setReactions(prev => prev.filter(reaction => reaction.user_id._id !== user._id))
            await deleteReaction(token, props._id)
        } else {
            setCommentReaction('like')
            const res = await createReaction(token, props._id, 'like', 'comment', props.user_id._id)
            setReactions(prev => [res, ...prev])
        }
    }

    const handleOddReaction = async (type) => {
        setCommentReaction(type)
        const res = await createReaction(token, props._id, type, 'comment', props.user_id._id)
        setReactions(prev => {
            let arr = prev.filter(reaction => reaction.user_id._id !== user._id)
            return [res, ...arr]
        })
    }

    const handleVisibility = () => {
        setRepliesVisibility(true)
    }

    useEffect(() => {
        getReactions(token, props._id).then(value => {
            setReactions(value)

            const myReaction = value.find((el) => el.user_id._id === user._id)
            if (myReaction) {
                setCommentReaction(myReaction.type)
            }
        })
    }, [user])

    useEffect(() => {
        getCommentsUnderPost(token, props.post_id, props._id)
            .then(value => {
                setReplies(value)
            })
    }, [])

    useEffect(() => {
        let arr = reactions.map(reaction => reaction.type)
        setReactionsFiltered([...new Set(arr)])
    }, [reactions])

    return (
        <div className={"comment " + props.className}>
            <div className="comment-user">
                <img src={props.user_id.profile} alt="User profile" />
            </div>
            <div className="comment-right">
                <div className="comment-content">
                    <NavLink to={'/' + props.user_id._id + '/'} className="comment-user-name">{props.user_id.first_name} {props.user_id.last_name}</NavLink>
                    <div className="comment-text">
                        {parse(parse(props.content))}
                    </div>
                    {reactions.length > 0 &&
                        <div className="comment-reactions">
                            <div className="comment-reactions-imgs">
                                {reactionsFiltered.map(reaction =>
                                    <img src={reactionImgs[reaction]} alt="Reaction" key={reaction}/>
                                )}
                            </div>
                            {reactions.length > 1 ? reactions.length : null}
                        </div>}
                </div>
                <div className="comment-extra">
                    <strong className={commentReaction ? commentReaction : ''} onClick={handleReaction}>{commentReaction ? commentReaction : 'Like'}</strong>
                    <div className="post-reactions-options comment">
                        {Object.entries(reactionImgs).map(reaction =>
                            <img src={reaction[1]} alt="" onClick={() => handleOddReaction(reaction[0])} key={reaction[1]}/>
                        )}
                    </div>
                    <strong onClick={handleVisibility}>Reply</strong>
                    <span>{getPostFormatted(props.create_date)}</span>
                </div>
                {repliesVisibility &&
                    <div className="comment-replies">
                        {replies.map(reply =>
                            <Comment {...reply} key={reply._id}/>
                        )}
                        <CommentForm post={props.post_id} comment={props._id} />
                    </div>
                }
                {(!repliesVisibility && replies.length > 0) &&
                    <div className="replies-count" onClick={handleVisibility}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-right-bottom</title><path d="M20 16L14.5 21.5L13.08 20.09L16.17 17H10.5C6.91 17 4 14.09 4 10.5V4H6V10.5C6 13 8 15 10.5 15H16.17L13.09 11.91L14.5 10.5L20 16Z" /></svg>
                        {replies.length} {replies.length > 1 ? 'Replies' : 'Reply'}
                    </div>
                }
            </div>

        </div>
    )
}