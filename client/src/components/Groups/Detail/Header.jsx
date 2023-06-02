import { useContext, useEffect, useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
import { joinGroup, updateGroup } from '../../../functions/group'
import { TokenContext } from '../../../contexts/TokenContext'
import { UserContext } from '../../../contexts/UserContext'
import { UpdateUserContext } from '../../../contexts/UpdateUserContext'
import { getFriends } from '../../../functions/relationship'
import Modal from '../../Modal'
import { queryUser } from "../../../functions/user"
import { deleteMultipleNotification, deleteNotification, getNotifications, upsertNotification } from "../../../functions/notification"

export default function Header(props) {
    const updateUser = useContext(UpdateUserContext)
    const [invitation, setInvitation] = useState([])
    const [content, setContent] = useState('')
    const [users, setUsers] = useState([])
    const [friends, setFriends] = useState([])

    const { token } = useContext(TokenContext)
    const user = useContext(UserContext)
    const [image, setImage] = useState()

    const handleInvite = (id) => {
        upsertNotification(token, id, {
            type: 'invite',
            group: props._id,
            user_id: id
        }).then(res => {
            console.log(res)
        })
    }

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleSave = (e) => {
        updateGroup(token, props._id, null, image)
    }

    const handleCancel = () => {
        setImage(null)
    }

    const handleContent = (e) => {
        setContent(e.target.value)
        if (e.target.value.length > 0) {
            queryUser(token, e.target.value)
                .then(value => {
                    setUsers(value.filter(user => !user.groups.includes(props._id)))
                })
        } else {
            setUsers([])
        }
    }

    const handleJoinGroup = async () => {
        setInvitation([])
        await joinGroup(token, props._id)
        updateUser(token)
        await deleteMultipleNotification(token, { group: props._id, user_id: user._id, type: 'invite' })
    }

    const handleDeclineInvite = async () => {
        await deleteMultipleNotification(token, { group: props._id, user_id: user._id, type: 'invite' })
        setInvitation([])
    }

    const isMember = useMemo(() => {
        if (!user._id) return null
        return user.groups.find(group => group._id === props._id) ? true : false
    }, [user.groups, props._id, user._id])

    useEffect(() => {
        if (!user._id) return
        getFriends(token, user._id, { limit: 25 }).then(res => {
            setFriends(res.map(rel => rel.user1_id._id !== user._id ? rel.user1_id : rel.user2_id))
        })

        getNotifications(token, { group: props._id, type: 'invite', user_id: user._id })
            .then(res => {
                setInvitation(res || [])
            })
    }, [props._id, token, user._id])

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
                        <div className="user-option group" onClick={handleJoinGroup}>
                            <svg fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x14ctfv xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g><path d="M97 391.5c-.827 0-1.5-.784-1.5-1.75 0-1.08.575-1.75 1.5-1.75s1.5.67 1.5 1.75c0 .966-.673 1.75-1.5 1.75m10 0c-.827 0-1.5-.784-1.5-1.75 0-1.08.575-1.75 1.5-1.75s1.5.67 1.5 1.75c0 .966-.673 1.75-1.5 1.75m-5-.5c-1.24 0-2.25-1.122-2.25-2.5 0-1.542.862-2.5 2.25-2.5s2.25.958 2.25 2.5c0 1.378-1.01 2.5-2.25 2.5m-5.5 5.06v-.496c0-.963.302-1.856.816-2.593a.3.3 0 0 0-.246-.471h-.388A2.685 2.685 0 0 0 94 395.182a1.32 1.32 0 0 0 1.319 1.318h.885a.302.302 0 0 0 .3-.318 1.975 1.975 0 0 1-.004-.122m7.5.94c0-.825.675-1.5 1.5-1.5h.5v-.5c0-.29.087-.56.231-.79a3.568 3.568 0 0 0-3.295-2.21h-1.872a3.568 3.568 0 0 0-3.564 3.564v.495c0 .795.646 1.441 1.44 1.441h5.153a1.46 1.46 0 0 1-.093-.5m3.04-3.42c.146-.048.299-.08.46-.08.825 0 1.5.675 1.5 1.5v.5h.5c.152 0 .296.03.434.072.04-.124.066-.253.066-.39a2.685 2.685 0 0 0-2.681-2.682h-.388a.3.3 0 0 0-.246.472c.134.192.251.396.355.608" transform="translate(354 160)"></path><path fill-rule="nonzero" d="M108 399v-4a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0z" transform="translate(354 160)"></path><path fill-rule="nonzero" d="M105.5 397.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0 0 1z" transform="translate(354 160)"></path></g></g></svg>
                            Join Group
                        </div>
                    </div>}
                    {isMember && <div className="user-options">
                        <Modal
                            classname={'profile-edit'}
                            title={'Invite people to this group'}
                            trigger={<div className="user-option group">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>
                                Invite
                            </div>}
                        >
                            <div className="group-invite-menu">
                                <div className="input-wrapper">
                                    <input style={content.length > 0 || users.length > 0 ? { paddingLeft: '16px' } : {}} type="text" placeholder="Search in Messenger" onInput={handleContent} value={content} />
                                    <svg style={content.length > 0 || users.length > 0 ? { display: 'none' } : {}} fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" class="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
                                </div>
                                {users.length > 0 && <div className="queried-users">
                                    {users.map(friend =>
                                        <div className="queried-user-small">
                                            <div className="queried-user-img"><img src={friend.profile} alt="" /></div>
                                            <div className="queried-user-name">{friend.first_name} {friend.last_name}</div>
                                            <div className="user-option group" style={{ marginLeft: 'auto', zIndex: '12' }} onClick={() => handleInvite(friend._id)} >Invite</div>
                                        </div>
                                    )}
                                </div>}
                                {content.length === 0 && users.length === 0 &&
                                    <>
                                        <h2 className="sub-title" style={{ marginBottom: '8px' }}>Suggested</h2>

                                        {friends.map(friend =>
                                            <div className="queried-user-small">
                                                <div className="queried-user-img"><img src={friend.profile} alt="" /></div>
                                                <div className="queried-user-name">{friend.first_name} {friend.last_name}</div>
                                                <div className="user-option group" style={{ marginLeft: 'auto', zIndex: '12' }} onClick={() => handleInvite(friend._id)}>Invite</div>
                                            </div>
                                        )}
                                    </>
                                }
                            </div>
                        </Modal>
                    </div>}

                </div>
                {invitation.length > 0 &&
                    <div className="user-relationship-confirm-wrapper">
                        <div className="user-relationship-confirm">
                            <div className="sub-title-smaller">{invitation[0].sender_id.first_name} invited you</div>
                            <div className="user-options">
                                <div className="user-option group" onClick={handleJoinGroup}>Join group</div>
                                <div className="user-option" onClick={handleDeclineInvite}>Delete invite</div>
                            </div>
                        </div>
                    </div>}
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