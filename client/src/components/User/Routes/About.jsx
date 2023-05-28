import { Route, Routes, useParams } from "react-router-dom";
import Section from "../../Section";
import { NavLink } from "react-router-dom";
import Overview from "../AboutRoutes/Overview";
import Work from "../AboutRoutes/Work";
import Education from "../AboutRoutes/Education";
import Places from "../AboutRoutes/Places";
import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../contexts/TokenContext";
import { getPostsWithPhotos } from "../../../functions/posts";

export default function About() {
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPostsWithPhotos(token, url.userId)
            .then(value => {
                const arr = [].concat(...value.map(post => {
                    if (post.multiple_media.length > 0) {
                        return post.multiple_media.map(media => { return { _id: post._id, media: media } })
                    } else {
                        return post
                    }
                }))
                setPosts(arr)
            })
    }, [url.groupId, token, url.userId])

    return (
        <div className="user-about">
            <Section noTitle className="details">
                <div className="user-section-left">
                    <h2 className="sub-title">Details</h2>
                    <NavLink to={'./'} className={'sub-route-link'}>Overview</NavLink>
                    <NavLink to={'./work'} className={'sub-route-link'}>Work</NavLink>
                    <NavLink to={'./education'} className={'sub-route-link'}>Education</NavLink>
                    <NavLink to={'./places'} className={'sub-route-link'}>Places lived</NavLink>
                    <NavLink to={'./contact'} className={'sub-route-link'}>Contact info</NavLink>
                </div>
                <div className="user-section-right">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/work" element={<Work />} />
                        <Route path="/education" element={<Education />} />
                        <Route path="/places" element={<Places />} />
                    </Routes>
                </div>
            </Section>
            <Section>
                <h2 className="sub-title">Photos</h2>
                {posts.length > 0 && <div className="group-media">
                    {posts.map(post =>
                        <NavLink to={'/photo/' + post._id} key={post.media + post._id}>
                            <img src={post.media} alt="Post media" />
                        </NavLink>
                    )}
                </div>}
            </Section>
        </div>
    )
}