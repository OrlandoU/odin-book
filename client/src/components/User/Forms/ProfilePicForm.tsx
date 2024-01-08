import { ChangeEventHandler, FormEventHandler, useContext, useState } from "react"
import { updateProfile } from "../../../functions/user"
import { Token, TokenContext } from "../../../contexts/TokenContext"

export default function ProfilePicForm() {
    const { token } = useContext(TokenContext) as Token

    const [content, setContent] = useState<string>('')
    const [profile, setProfile] = useState<File>()

    const handleProfile: ChangeEventHandler = (e) => {
        let target = e.target as HTMLInputElement
        target.files && setProfile(target.files[0])
    }

    const removeProfile = () => {
        setProfile(undefined)
    }

    const handleContent: ChangeEventHandler = (e) => {
        let target = e.target as HTMLInputElement
        setContent(target.value)
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (profile) {
            updateProfile(token, profile, content).then(value => window.location.reload())
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="about-form" id="edit-profile-pic">
                <label>
                    <input type="text" value={content} onChange={handleContent} placeholder=" " />
                    <div className="input-label">Description</div>
                </label>
                {profile && <div className="post-create-images-wrapper">
                    <div className={"post-create-images length user-profile-pic-edit"} >
                        <img src={URL.createObjectURL(profile)} alt="" />
                        <svg className="post-create-images-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={removeProfile}><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path></svg>
                    </div>
                </div>}
                {!profile && <label className="group-create-link">
                    Upload photo
                    <input type="file" onChange={handleProfile} hidden />
                </label>}
            </form>
            <div className="edit-profile-pics-buttons">
                <button>Cancel</button>
                <button form="edit-profile-pic" className={!profile ? "unavailable" : ''}>Save</button>
            </div>
        </>
    )
}