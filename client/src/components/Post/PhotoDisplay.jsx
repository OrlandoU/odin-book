import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getPosts } from "../../functions/posts"
import { TokenContext } from "../../contexts/TokenContext"
import PostModal from "./PostModal"
import NavOptions from "../Nav/NavOptions"

export default function PhotoDisplay() {
    const { token } = useContext(TokenContext)
    const url = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [photoIndex, setPhotoIndex] = useState()
    const [post, setPost] = useState({})


    const handleRightButton = () => {
        if (photoIndex + 1 < post.multiple_media.length) {
            setPhotoIndex(prev => prev + 1)
        }
    }

    const handleLeftButton = () => {
        if (photoIndex > 0) {
            setPhotoIndex(prev => prev - 1)
        }
    }

    const handleBackNavigate = (e) => {
        navigate(-1)
    }

    useEffect(() => {
        getPosts(token, { _id: url.postId })
            .then(value => {
                setPost(value[0])
            })
        setPhotoIndex(+url.index || 0)
    }, [url, token])

    return (
        <main className="main-home">
            <section className="photo-expanded">
                <div className="photo-expanded-image">
                    <div className="photo-expanded-close" onClick={handleBackNavigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Close expanded photo</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
                    </div>
                    {(photoIndex > 0 && post.multiple_media) && <div className="left-photo-button" onClick={handleLeftButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Go to previous photo</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
                    </div>}
                    {post._id &&
                        <img src={post.media || post.multiple_media[photoIndex]} alt="" />
                    }
                    {(post.multiple_media && photoIndex + 1 < post.multiple_media.length) && <div className="right-photo-button" onClick={handleRightButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Go to next photo</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
                    </div>}
                </div>
                <div className="photo-post">
                    <NavOptions />
                    {post._id && <PostModal {...post} isExpanded isPhoto />}
                </div>
            </section>
        </main>
    )
}