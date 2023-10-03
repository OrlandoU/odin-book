import { useContext, useEffect, useState } from "react";
import Section from "../../Section";
import { getPostsWithPhotos } from "../../../functions/posts";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import { NavLink, Params, useParams } from "react-router-dom";
import User from "../../../interfaces/User";

export interface MediaPosts { 
    media?: string,
    _id?: string,
    user_id?: string | User
}

export default function Media(): JSX.Element {
    const url: Readonly<Params<string>> = useParams()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<MediaPosts[]>([])

    useEffect(() => {
        if(url.userId){
            getPostsWithPhotos(token, url.userId)
                .then(value => {
                    if(value){
                        const arr = value.flatMap(post => {
                            if (post.multiple_media.length > 0) {
                                return post.multiple_media.map(media => { return { _id: post._id, media: media } })
                            } else {
                                return post
                            }
                        })
                        setPosts(arr)
                    }
                })
        }
    }, [url.groupId, token, url.userId])

    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Photos</h2>
                {posts.length > 0 && <div className="group-media">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post._id} key={post.media}>
                            <img src={post.media} alt="Post media" />
                        </NavLink>
                    )}
                </div>}
            </Section>
        </div>
    )
}