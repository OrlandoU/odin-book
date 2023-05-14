import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { createPost } from "../../functions/posts"
import { Mention, MentionsInput } from "react-mentions"
import { queryUser } from "../../functions/user"
import Modal from '../Modal'
import { UserContext } from "../../contexts/UserContext"

export default function PostForm() {
    const [files, setFiles] = useState([])
    const [show, setShow] = useState(false)
    const [privacy, setPrivacy] = useState('Public')
    const [mentions, setMentions] = useState(null)
    const [content, setContent] = useState('')
    const user = useContext(UserContext)
    const { token } = useContext(TokenContext)


    const handleFiles = (e) => {
        setFiles(prev => [...e.target.files, ...prev])
    }

    const handleRemoveFiles = () => {
        setFiles(null)
    }

    const handleContent = (e, i, j, y) => {
        setMentions(y.map(mention => mention.id))
        setContent(e.target.value)
    }

    const handleSuggestion = (entry, newValue, newEntry, mentions) => {
        return (
            <div className="post-header mention">
                <div className="post-user">
                    <img src={entry.profile} alt="" />
                </div>
                <div className="post-subheader">
                    <div className="post-name">{entry.first_name} {entry.last_name}</div>
                </div>
            </div>
        )
    }

    const markup = `<a href="/__id__/">__display__</a>`;

    const handleData = async (search, cb) => {
        if (search.length) {
            const q = await queryUser(token, search)
            if (!q) {
                return null
            }
            cb(q.filter(el => el._id !== user._id).map(queriedUser => {
                return { id: queriedUser._id, ...queriedUser, display: `${queriedUser.first_name} ${queriedUser.last_name}` }
            }))
        }
    }

    const displayTransform = (id, display) => {
        return display
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await createPost(token, content, mentions, files)
        console.log(response)
    }

    const handlePublic = () => {
        setShow(false)
        setPrivacy('Public')
    }
    const handleFriends = () => {
        setShow(false)
        setPrivacy('Friends')
    }
    const handleMe = () => {
        setShow(false)
        setPrivacy('Me')
    }
    const togglePrivacy = (e) => {
        e.stopPropagation()
        setShow(true)
    }

    if (!user._id) {
        return null
    }

    return (

        <form onSubmit={handleSubmit} className="post post-form" >
            <div className="post-form-header flex">
                <div className="post-user">
                    <img src={user.profile} alt="" />
                </div>

                <Modal
                    onClick={() => setShow(false)}
                    classname={'post-form-create'}
                    title={'Create Post'}
                    trigger={
                        <div class="input-wrapper">
                            <input className="hover-bar" type="text" placeholder={"What's on your mind, " + user.first_name[0].toUpperCase() + user.first_name.slice(1)} disabled />
                        </div>
                    }>
                    <div class="post-header" x>
                        <div class="post-user">
                            <img src="http://localhost:3000/images/user-images/hector-rojo-render-redessociales-01.jpg" alt="" />
                        </div>
                        <div class="post-subheader">
                            <div class="post-type-name" style={{ textDecoration: 'none' }}>
                                <div className="post-name" >{user.first_name} {user.last_name}</div>
                            </div>
                            <div class="post-data">
                                <span onClick={togglePrivacy}>{privacy}</span>
                                {show && <div className="group-options" onClick={(e) => e.stopPropagation()}>
                                    <div className="group-option" onClick={handlePublic}>
                                        <div className="group-option-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>earth</title><path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
                                        </div>
                                        <div className="group-option-info">
                                            <div className="group-option-header">Public</div>
                                            <div className="group-option-data">Anyone on or off facebook.</div>
                                        </div>
                                    </div>
                                    <div className="group-option" onClick={handleFriends}>
                                        <div className="group-option-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-multiple</title><path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" /></svg>
                                        </div>
                                        <div className="group-option-info">
                                            <div className="group-option-header">Friends</div>
                                            <div className="group-option-data">Your friends on facebook.</div>
                                        </div>
                                    </div>
                                    <div className="group-option" onClick={handleMe}>
                                        <div className="group-option-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>lock</title><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg>
                                        </div>
                                        <div className="group-option-info">
                                            <div className="group-option-header">Only Me</div>
                                            <div className="group-option-data">Only you can see this post.</div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="post-form-content">
                        <MentionsInput value={content} onChange={handleContent} className="post-content-input" placeholder={"What's on your mind, " + user.first_name[0].toUpperCase() + user.first_name.slice(1)}>
                            <Mention
                                trigger="@"
                                data={handleData}
                                renderSuggestion={handleSuggestion}
                                markup={markup}
                                displayTransform={displayTransform}
                            />
                        </MentionsInput>
                        {files.length > 0 &&
                            <div className="post-create-images-wrapper">
                                <div className={"post-create-images length" + files.length} >
                                    {files.map(file =>
                                        <img src={URL.createObjectURL(file)} alt="" />
                                    )}
                                    <span className='post-create-images-add'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image-plus</title><path d="M18 15V18H15V20H18V23H20V20H23V18H20V15H18M13.3 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V13.3C20.4 13.1 19.7 13 19 13C17.9 13 16.8 13.3 15.9 13.9L14.5 12L11 16.5L8.5 13.5L5 18H13.1C13 18.3 13 18.7 13 19C13 19.7 13.1 20.4 13.3 21Z" /></svg>
                                        Add image
                                    </span>
                                    <svg className="post-create-images-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={handleRemoveFiles}><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path></svg>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="post-form-extras">
                        <div className="post-name">
                            Add to your post
                        </div>
                        <div className="post-form-extras-options">
                            <label >
                                <input type="file" multiple onChange={handleFiles} hidden />
                                <svg fill="#4DB863" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image-multiple</title><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"></path></svg>
                            </label>
                        </div>
                    </div>
                    <button onClick={handleSubmit}>Post</button>
                </Modal>

            </div>
            <div className="post-options">
                <div className="post-button">
                    <div className="post-button-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image-multiple</title><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6" /></svg></div>
                    <div className="post-button-text">Photo/Video</div>
                </div>
            </div>
        </form>
    )
}
