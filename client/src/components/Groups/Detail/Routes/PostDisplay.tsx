import { useContext, useEffect, useState } from "react"
import { Token, TokenContext } from "../../../../contexts/TokenContext"
import { NavLink, Params, useParams } from "react-router-dom"
import { getPosts, getPostsWithPhotos } from "../../../../functions/posts"
import PostModal from "../../../Post/PostModal"
import LeftBar from "../LeftBar"
import Section from "../../../Section"
import Post from "../../../../interfaces/Post"

interface Props {
    privacy: string
}

export default function PostDisplay(props: Props): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const url: Readonly<Params<string>> = useParams()
    const [post, setPost] = useState<Post>()
    const [media, setMedia] = useState<any[]>([])

    useEffect(() => {
        getPosts(token, { _id: url.postId })
            .then(value => {
                if (value) setPost(value[0])
            })
        getPostsWithPhotos(token, "", { group: url.groupId })
            .then(value => {
                if (value) {
                    const arr = value.flatMap(post => {
                        if (post.multiple_media.length > 0) {
                            return post.multiple_media.map(media => ({ media, id: post._id, user_id: post.user_id }));
                        } else {
                            return [{ media: post.media, id: post._id, user_id: post.user_id }];
                        }
                    });

                    setMedia(arr.slice(0, 9) || [])
                }
            })
        document.body.click()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, url.postId])


    return (
        <div className="user-data">
            <section>
                {post && post._id && <PostModal {...post} isExpanded />}
            </section>
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
                    <Section title={'Media'}>
                        {media.length > 0 && <div className="photos-container">
                            {media.map(photo =>
                                <NavLink to={'/photo/' + photo.id}>
                                    <img src={photo.media} alt="Group media" />
                                </NavLink>
                            )}
                        </div>}
                    </Section>
                </Section>
            </LeftBar>
        </div>
    )
}