import { useContext, useState } from "react";
import { createUserJob, updateUserJob } from "../../../functions/user";
import { TokenContext } from '../../../contexts/TokenContext'
import { UpdateUserContext } from '../../../contexts/UpdateUserContext'
import HiddenMenu from "../../HiddenMenu";
import { deleteUserJob } from "../../../functions/user";

export default function JobForm(props) {
    const updateUser = useContext(UpdateUserContext)
    const { token } = useContext(TokenContext)

    const [expanded, setExpanded] = useState(false)
    const [company, setCompany] = useState(props.company || '')
    const [position, setPosition] = useState(props.position || '')
    const [location, setLocation] = useState(props.location || '')
    const [isCurrent, setIsCurrent] = useState(props.is_current)

    const handleClose = () => {
        setCompany('')
        setPosition('')
        setLocation('')
        setIsCurrent()
        setExpanded(false)
    }

    const handleOpen = () => {
        setExpanded(true)
    }

    const handleCompany = (e) => {
        setCompany(e.target.value)
    }

    const handlePosition = (e) => {
        setPosition(e.target.value)
    }

    const handleLocation = (e) => {
        setLocation(e.target.value)
    }

    const handleIsCurrent = (e) => {
        setIsCurrent(e.target.checked)
    }

    const handleRemove = () => {
        deleteUserJob(token, props._id).then(()=>{
            updateUser(token)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (props.isPreview) {
            updateUserJob(token, props._id, company || '', position, location || '', isCurrent).then(()=>{
                updateUser(token)
                handleClose()
            })
        } else {
            createUserJob(token, company || '', position || '', location || '', isCurrent)
                .then(() => {
                    updateUser(token)
                    handleClose()
                })
        }
    }
    if (props.isPreview && !expanded) {
        return (
            <div className="about-preview">
                <div className="preview-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>briefcase-variant</title><path d="M10 16V15H3L3 19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V15H14V16H10M20 7H16V5L14 3H10L8 5V7H4C2.9 7 2 7.9 2 9V12C2 13.11 2.89 14 4 14H10V12H14V14H20C21.1 14 22 13.1 22 12V9C22 7.9 21.1 7 20 7M14 7H10V5H14V7Z" /></svg>
                </div>
                <div className="preview-data">
                    <div className="preview-data-top">
                        {props.position.length > 0 ? <span>{props.position}</span> : props.is_current ? 'Works' : 'Worked'} at <span>{props.company}</span>
                    </div>
                    <div className="preview-data-bottom">
                        {props.location}
                    </div>
                </div>
                <HiddenMenu>
                    <span onClick={handleOpen}>Edit WorkPlace</span>
                    <span onClick={handleRemove}>Remove WorkPlace</span>
                </HiddenMenu>
            </div>
        )
    }

    if (!expanded) {
        return (
            <div className="about-expand" onClick={handleOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>
                Add workplace
            </div>
        )
    }

    return (
        <form className="about-form" onSubmit={handleSubmit}>
            <label>
                <input type="text" value={company} onChange={handleCompany} placeholder=" " />
                <div className="input-label">Company</div>
            </label>
            <label>
                <input type="text" value={position} onChange={handlePosition} placeholder=" " />
                <div className="input-label">Position</div>
            </label>
            <label >
                <input type="text" value={location} onChange={handleLocation} placeholder=" " />
                <div className="input-label">Location</div>
            </label>
            <label className="not">
                <input className="checkbox" type="checkbox" checked={isCurrent} onChange={handleIsCurrent} placeholder=" " />
                <div className="checkbox">I am currently working here</div>
            </label>
            <div className="about-form-buttons">
                <div onClick={handleClose}>Cancel</div>
                <button>Save</button>
            </div>
        </form>
    )
}