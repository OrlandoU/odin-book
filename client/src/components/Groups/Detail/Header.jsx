import { useContext, useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
import { updateGroup } from '../../../functions/group'
import { TokenContext } from '../../../contexts/TokenContext'
import { UserContext } from '../../../contexts/UserContext'

export default function Header(props) {
    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)

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



    const isMember = useMemo(() => {
        if (!user._id) return null
        return user.groups.find(group => group._id === props._id) ? true : false
    }, [user.groups, props._id, user._id])

    return (
        <header className="user-header">
            <div className="header-wrapper">
                <input type="file" hidden id="cover-input" onChange={handleImage} />
                <div className="cover">
                    {image && <div className="save-buttons">
                        <div className="cancel" onClick={handleCancel}>Cancel</div>
                        <div className="save" onClick={handleSave}>Save</div>
                    </div>}
                    <img src={image ? URL.createObjectURL(image) : props.cover} alt="" />
                    <label htmlFor="cover-input" class="user-edit-option user-option"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>Edit</label>
                </div>
                <div className="user-info">
                    <div className="user-details">
                        <div className="user-name">{props.name}</div>
                        <div className="user-friends-pics">
                            {props.members.length > 0 && props.members.map(member =>
                                <div className="friend-pic" key={member._id}>
                                    <img src={member.profile} alt="Member profile" />
                                </div>
                            )}
                        </div>
                    </div>

                    {!isMember && <div className="user-options">
                        <div className="user-option group">
                            <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x14ctfv xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g><path d="M97 391.5c-.827 0-1.5-.784-1.5-1.75 0-1.08.575-1.75 1.5-1.75s1.5.67 1.5 1.75c0 .966-.673 1.75-1.5 1.75m10 0c-.827 0-1.5-.784-1.5-1.75 0-1.08.575-1.75 1.5-1.75s1.5.67 1.5 1.75c0 .966-.673 1.75-1.5 1.75m-5-.5c-1.24 0-2.25-1.122-2.25-2.5 0-1.542.862-2.5 2.25-2.5s2.25.958 2.25 2.5c0 1.378-1.01 2.5-2.25 2.5m-5.5 5.06v-.496c0-.963.302-1.856.816-2.593a.3.3 0 0 0-.246-.471h-.388A2.685 2.685 0 0 0 94 395.182a1.32 1.32 0 0 0 1.319 1.318h.885a.302.302 0 0 0 .3-.318 1.975 1.975 0 0 1-.004-.122m7.5.94c0-.825.675-1.5 1.5-1.5h.5v-.5c0-.29.087-.56.231-.79a3.568 3.568 0 0 0-3.295-2.21h-1.872a3.568 3.568 0 0 0-3.564 3.564v.495c0 .795.646 1.441 1.44 1.441h5.153a1.46 1.46 0 0 1-.093-.5m3.04-3.42c.146-.048.299-.08.46-.08.825 0 1.5.675 1.5 1.5v.5h.5c.152 0 .296.03.434.072.04-.124.066-.253.066-.39a2.685 2.685 0 0 0-2.681-2.682h-.388a.3.3 0 0 0-.246.472c.134.192.251.396.355.608" transform="translate(354 160)"></path><path fill-rule="nonzero" d="M108 399v-4a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0z" transform="translate(354 160)"></path><path fill-rule="nonzero" d="M105.5 397.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0 0 1z" transform="translate(354 160)"></path></g></g></svg>
                            Join Group
                        </div>
                    </div>}
                    {isMember && <div className="user-options">
                        <div className="user-option group">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
                            Invite
                        </div>
                    </div>}

                </div>
                <div className="user-routes">
                    <div className="user-routes-wrapper">
                        <NavLink to={'./'}>Discussion</NavLink>
                        <NavLink to={'./people'}>People</NavLink>
                        <NavLink to={'./media'}>Media</NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}