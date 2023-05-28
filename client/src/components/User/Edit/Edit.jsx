import { useContext, useState } from "react";
import Modal from "../../Modal";
import { updateProfile } from "../../../functions/user";
import { TokenContext } from '../../../contexts/TokenContext'
import { UserContext } from "../../../contexts/UserContext";
import ProfilePicForm from "../Forms/ProfilePicForm";
import CoverPicForm from "../Forms/CoverPicForm";

export default function Edit() {
    const user = useContext(UserContext)


    if (!user._id) {
        return null
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
                        classname={'profile-edit edit-profile-pic'}
                        title={'Update profile picture'}
                        trigger={
                            <span className="profile-add">Add</span>
                        }>
                            <ProfilePicForm />
                    </Modal>
                </h2>
                <div class="user-profile-pic-edit">
                    <img alt="" src={user.profile} />
                </div>
                <h2 className="sub-title">
                    Cover Photo
                    <Modal
                        classname={'profile-edit edit-profile-pic'}
                        title={'Update Cover Photo'}
                        trigger={
                            <span className="profile-add">Add</span>
                        }>
                            <CoverPicForm />
                    </Modal>
                </h2>
                <div class="user-cover-pic-edit">
                    <img alt="" src={user.cover} />
                </div>
                <h2 className="sub-title">Customize your Intro</h2>
                {user.jobs.map((job , index)=>
                    <div className="intro-section" key={index}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>briefcase-variant</title><path d="M10 16V15H3L3 19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V15H14V16H10M20 7H16V5L14 3H10L8 5V7H4C2.9 7 2 7.9 2 9V12C2 13.11 2.89 14 4 14H10V12H14V14H20C21.1 14 22 13.1 22 12V9C22 7.9 21.1 7 20 7M14 7H10V5H14V7Z" /></svg>
                        <span>{job.position ? <strong>{job.position}</strong> : job.isCurrent ? 'Works' : 'Worked'} at <strong>{job.company}</strong></span>
                    </div>
                )}
                {user.academics.map((academic, index) =>
                    <div className="intro-section" key={index}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>school</title><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
                        <span>{academic.isCurrent ? 'Studies' : 'Studied'} at <strong>{academic.school}</strong></span>
                    </div>
                )}
                {user.current_place && <div className="intro-section">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>home-variant</title><path d="M12,3L20,9V21H15V14H9V21H4V9L12,3Z" /></svg>
                    <span>Lives in <strong>{user.current_place}</strong></span>
                </div>}
                {user.birth_place && <div className="intro-section">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>map-marker</title><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>
                    <span>From <strong>{user.birth_place}</strong></span>
                </div>}
                <div className="group-create-link">Edit your about info</div>
            </div>
        </Modal>
    )
}