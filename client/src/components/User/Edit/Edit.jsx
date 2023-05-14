import { useContext, useState } from "react";
import Modal from "../../Modal";
import { updateProfile } from "../../../functions/user";
import {TokenContext} from '../../../contexts/TokenContext'

export default function Edit() {
    const {token} = useContext(TokenContext)
    const [content, setContent] = useState('')
    const [profile, setProfile] = useState()

    const handleProfile = (e) => {
        setProfile(e.target.files[0])
    }

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    const handleSubmit = (e) => {
        e.stopPropagation()
        e.preventDefault()
        updateProfile(token, profile, content).then(value=>console.log(value))
    }

    return (
        <Modal
            classname={'profile-edit'}
            title='Edit profile'
            trigger={
                <div className="user-edit-option user-option">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
                    Edit
                </div>
            }>
            <div>
                <h2 className="sub-title">
                    Profile Picture
                    <Modal
                        classname={'profile-edit'}
                        title={'Update profile picture'}
                        trigger={
                            <span className="profile-add">Add</span>
                        }>
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleProfile} />
                            <input type="text" value={content} onChange={handleContent} />
                            <button>Submit</button>
                        </form>

                    </Modal>
                </h2>
                <div className="group-create-link">Edit your about info</div>
            </div>
        </Modal>
    )
}