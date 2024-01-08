import { NavLink } from "react-router-dom";
import HiddenMenu from "../HiddenMenu";
import { updatePost } from "../../functions/posts";
import { Token, TokenContext } from "../../contexts/TokenContext";
import { useContext, MouseEventHandler } from "react";
import Post from "../../interfaces/Post";

interface Props extends Post{
    removePost: (id: string) => void
}

export default function PostSavedPreview(props: Props): JSX.Element {
    const { token } = useContext(TokenContext) as Token

    const handleUnsavePost: MouseEventHandler = () => {
        if(!props._id) return
        updatePost(token, props._id, { _id: props._id, unsave: true }).then(res => {
            if(!res || !res._id) return
            document.body.click()
            props.removePost(res._id)
        })
    }

    return (
        <div className="post-saved">
            <div className="post-saved-media">{
                props.media?
                    <img src={props.media} alt="" />
                    : props.multiple_media && props.multiple_media.length > 0 ?
                        <img src={props.multiple_media[0]} alt="" />
                        : null
            }</div>
            <div className="post-saved-info">
                <div className="post-saved-content">{props.content}</div>
                <div className="post-saved-origin">
                    <div className={!props.group ? "post-user saved" : "saved post-user group"}>
                        {(props.group) ?
                            <>
                                <div className="group-post">
                                    {typeof props.group !== 'string' && <img src={props.group.cover} alt="" />}
                                </div>
                                <div className="group-post-user">
                                    {typeof props.user_id !== 'string' && props.user_id && <img src={props.user_id.profile} alt="" className="img-profile" />}
                                </div>
                            </> :
                            <>
                                {typeof props.user_id !== 'string' && props.user_id && <img src={props.user_id.profile} alt="" className="img-profile" />}
                            </>
                        }
                    </div>
                    Saved from
                    <NavLink to={!props.group ? `/post/${props._id}/` : `/groups/${typeof props.group !== 'string' && props.group._id}/${props._id}`} className={'post-name'} style={{ display: 'inline' }}>
                        {props.user_id && typeof props.user_id !== 'string' && props.user_id.first_name} {props.user_id && typeof props.user_id !== 'string' && props.user_id.last_name}'s post
                    </NavLink>
                    {props.group && 'in'}
                    {props.group && typeof props.group !== 'string' && <NavLink to={'/groups/' + props.group._id + '/'} className={'post-name'} style={{ display: 'inline' }}>
                        {props.group.name}
                    </NavLink>}
                </div>
                <HiddenMenu className={'user-option'}>
                    <span onClick={handleUnsavePost}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark-off-outline</title><path d="M3.28,4L2,5.27L5,8.27V21L12,18L16.78,20.05L18.73,22L20,20.72L3.28,4M7,18V10.27L13,16.25L12,15.82L7,18M7,5.16L5.5,3.67C5.88,3.26 6.41,3 7,3H17A2,2 0 0,1 19,5V17.16L17,15.16V5H7V5.16Z" /></svg>
                        Unsave Post
                    </span>
                </HiddenMenu>
            </div>
        </div>
    )
}