import { useContext, useEffect, useState } from "react";
import Section from "../../../Section";
import {  getPostsWithPhotos } from "../../../../functions/posts";
import { Token, TokenContext } from "../../../../contexts/TokenContext";
import { NavLink, useParams } from "react-router-dom";
import Post from "../../../../interfaces/Post";


export default function Media(): JSX.Element {
    const url = useParams()
    const { token } = useContext(TokenContext) as Token
    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        getPostsWithPhotos(token, "", { group: url.groupId })
            .then(value => {
                if(!value) return
                const arr = value.flatMap((post)=>{
                    if (post.multiple_media.length > 0) {
                        return post.multiple_media.map(media => { return { _id: post._id, media: media } })
                    } else {
                        return post
                    }
                })
                setPosts(arr)
            })
    }, [url.groupId, token])

    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Media</h2>
                <div className="group-media">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post._id} key={post.media}>
                            <img src={post.media} alt="Post media" />
                        </NavLink>
                    )}
                </div>
            </Section>
        </div>
    )
}