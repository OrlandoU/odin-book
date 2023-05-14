import { useContext, useState } from "react"
import { NavLink } from "react-router-dom"
import {updateGroup} from '../../../functions/group'
import {TokenContext} from '../../../contexts/TokenContext'

export default function Header(props) {
    const {token } = useContext(TokenContext)
    const [image, setImage] = useState()

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }
    
    const handleSave = (e) => {
        updateGroup(token, props._id, null, image)
    }

    const handleCancel = () => {
        setImage(null)
    }

    return (
        <header className="user-header">
            <div className="header-wrapper">
                <input type="file" hidden id="cover-input" onChange={handleImage}/>
                <div className="cover">
                    {image && <div className="save-buttons">
                        <div className="cancel" onClick={handleCancel}>Cancel</div>
                        <div className="save" onClick={handleSave}>Save</div>
                    </div>}
                    <img src={image ? URL.createObjectURL(image): props.cover} alt="" />
                    <label htmlFor="cover-input" class="user-edit-option user-option"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>Edit</label>
                </div>
                <div className="user-info">
                    <div className="user-details">
                        <div className="user-name">{props.name}</div>
                        <div className="user-friends-pics">
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                        </div>
                    </div>

                    <div className="user-options">

                    </div>
                </div>
                <div className="user-routes">
                    <div className="user-routes-wrapper">
                        <NavLink to={'./'}>Posts</NavLink>
                        <NavLink to={'./people'}>People</NavLink>
                        <NavLink to={'./media'}>Media</NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}