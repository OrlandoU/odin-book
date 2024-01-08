import { useContext, useEffect, useState, MouseEventHandler } from "react"
import { NavigateFunction, Params, useNavigate, useParams } from "react-router-dom"
import { getPosts } from "../../functions/posts"
import { Token, TokenContext } from "../../contexts/TokenContext"
import PostModal from "./PostModal"
import NavOptions from "../Nav/NavOptions"
import Post from "../../interfaces/Post"

interface Props {
    setIsDarkMode: (val: boolean) => void,
    setIsCompact: (val: boolean) => void,
    isCompact: boolean,
    isDarkMode: boolean
}


export default function PhotoDisplay({isCompact, isDarkMode, setIsCompact, setIsDarkMode}: Props): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const url : Readonly<Params<string>> = useParams()
    const navigate: NavigateFunction = useNavigate()

    const [photoIndex, setPhotoIndex] = useState<number>(0)
    const [post, setPost] = useState<Post>()


    const handleRightButton: MouseEventHandler = () => {
        if (photoIndex && post && photoIndex + 1 < post.multiple_media!.length) {
            setPhotoIndex(prev => prev + 1)
        }
    }

    const handleLeftButton: MouseEventHandler = () => {
        if (photoIndex && photoIndex > 0) {
            setPhotoIndex((prev: number )=> prev - 1)
        }
    }

    const handleBackNavigate: MouseEventHandler = (e) => {
        navigate(-1)
    }

    useEffect(() => {
        setPhotoIndex((url.index && +url.index) || 0)
        getPosts(token, { _id: url.postId })
            .then(value => {
                value && setPost(value[0])
            })
    }, [url, token])

    return (
        <main className="main-home">
            <section className="photo-expanded">
                <div className="photo-expanded-image">
                    <div className="photo-expanded-close" onClick={handleBackNavigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Close expanded photo</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
                    </div>
                    {(photoIndex && post && photoIndex > 0 && post.multiple_media) && <div className="left-photo-button" onClick={handleLeftButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Go to previous photo</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>
                    </div>}
                    {post && post._id &&
                        <img src={post.media || post.multiple_media![photoIndex]} alt="" />
                    }
                    {(post && photoIndex && post.multiple_media && photoIndex + 1 < post.multiple_media.length) && <div className="right-photo-button" onClick={handleRightButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Go to next photo</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
                    </div>}
                </div>
                <div className="photo-post">
                    <NavOptions isCompact={isCompact} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsCompact={setIsCompact} />
                    {post && post._id && <PostModal {...post} isExpanded isPhoto />}
                </div>
            </section>
        </main>
    )
}