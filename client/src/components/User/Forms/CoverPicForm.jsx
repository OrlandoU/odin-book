import { useContext, useState } from "react"
import { updateCover } from "../../../functions/user"
import { TokenContext } from "../../../contexts/TokenContext"

export default function CoverPicForm() {
    const { token } = useContext(TokenContext)

    const [content, setContent] = useState('')
    const [cover, setCover] = useState()

    const handleProfile = (e) => {
        setCover(e.target.files[0])
    }

    const removeProfile = () => {
        setCover(null)
    }

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    const handleSubmit = (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (cover) {
            updateCover(token, cover, content).then(value => console.log(value))
        }

    }


    return (
        <>
            <form onSubmit={handleSubmit} className="about-form" id="edit-profile-pic">
                <label>
                    <input type="text" value={content} onChange={handleContent} placeholder=" "/>
                    <div className="input-label">Description</div>
                </label>
                {cover && <div className="post-create-images-wrapper">
                    <div className={"post-create-images length user-cover-pic-edit"} >
                        <img src={URL.createObjectURL(cover)} alt="" />
                        <svg className="post-create-images-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={removeProfile}><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path></svg>
                    </div>
                </div>}
                {!cover && <label className="group-create-link">
                    Upload photo
                    <input type="file" onChange={handleProfile} hidden />
                </label>}
            </form>
            <div className="edit-profile-pics-buttons">
                <button>Cancel</button>
                <button form="edit-profile-pic" className={!cover ? "unavailable" : ''}>Save</button>
            </div>
        </>
    )
}