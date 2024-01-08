import { ChangeEventHandler, FormEventHandler, MouseEventHandler, useContext, useEffect, useState } from 'react';
import Aside from '../../Aside'
import { UserContext } from '../../../contexts/UserContext'
import { Token, TokenContext } from '../../../contexts/TokenContext'
import { createGroup } from '../../../functions/group';
import User from '../../../interfaces/User';

export default function Create(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const user = useContext(UserContext) as User
    const [show, setShow] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [privacy, setPrivacy] = useState<string>('')

    const handlePublic: MouseEventHandler = (e) => {
        setPrivacy('Public')
    }

    const handlePrivate: MouseEventHandler = (e) => {
        setPrivacy('Private')
    }

    const handleName: ChangeEventHandler = (e) => {
        const target = e.target as HTMLInputElement
        setName(target.value)
    }

    const close = () => {
        setShow(false)
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        createGroup(token, name, privacy.toLowerCase())
    }

    useEffect(() => {
        window.addEventListener('click', close)

        return () => {
            window.removeEventListener('click', close)
        }
    }, [])

    return (
        <>
            <Aside>
                <h2>Create Group</h2>
                <div className="group-admin">
                    <div className="group-admin-pic"></div>
                    <div className="group-admin-data">
                        <div className="group-admin-name">{user.first_name} {user.last_name}</div>
                        <div className="group-admin-role">Admin</div>
                    </div>
                </div>
                <form className="about-form" id='form' onSubmit={handleSubmit}>
                    <label>
                        <input type="text" placeholder=" " required value={name} onChange={handleName} />
                        <div className="input-label">Group name</div>
                    </label>
                    <label >
                        <input onClick={(e) => {
                            e.stopPropagation()
                            setShow(prev => !prev)
                        }} type="text" placeholder=" " required value={privacy} className='select-input' />
                        <div className="input-label" >Choose privacy</div>
                        {show && <div className="group-options" onClick={(e) => e.stopPropagation()} >
                            <div className="group-option" onClick={handlePublic}>
                                <div className="group-option-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>earth</title><path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
                                </div>
                                <div className="group-option-info">
                                    <div className="group-option-header">Public</div>
                                    <div className="group-option-data">Anyone can see who's in the group and what they post.</div>
                                </div>
                            </div>
                            <div className="group-option" onClick={handlePrivate}>
                                <div className="group-option-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>lock</title><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" /></svg>
                                </div>
                                <div className="group-option-info">
                                    <div className="group-option-header">Private</div>
                                    <div className="group-option-data">Only members can see who's in the group and what they post.</div>
                                </div>
                            </div>
                        </div>}
                    </label>
                    <input type="submit" id='group-submit' hidden />
                </form>
                <label htmlFor='group-submit' className="main-group-create">Create</label>
            </Aside>
        </>
    )
}