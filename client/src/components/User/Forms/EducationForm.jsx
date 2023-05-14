import { useContext, useState } from "react";
import HiddenMenu from "../../HiddenMenu";
import { createUserAcademic, updateUserAcademic } from "../../../functions/user";
import { TokenContext } from "../../../contexts/TokenContext";

export default function EducationForm(props) {
    const token = useContext(TokenContext).token
    const [expanded, setExpanded] = useState(false)
    const [school, setSchool] = useState(props.school || '')
    const [isCurrent, setIsCurrent] = useState(props.is_current)

    const handleClose = () => {
        setSchool('')
        setIsCurrent()
        setExpanded(false)
    }

    const handleOpen = () => {
        setExpanded(true)
    }

    const handleSchool = (e) => {
        setSchool(e.target.value)
    }

    const handleIsCurrent = (e) => {
        setIsCurrent(e.target.checked)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (props.isPreview) {
            updateUserAcademic(token, props._id, school, isCurrent)
        } else {
            createUserAcademic(token, school, isCurrent)
        }
    }

    if (props.isPreview && !expanded) {
        return (
            <div className="about-preview">
                <div className="preview-icon"></div>
                <div className="preview-data">
                    <div className="preview-data-top">
                        {props.is_current ? 'Studies' : 'Studied'} at <span>{props.school}</span>
                    </div>
                    <div className="preview-data-bottom">
                        {props.location}
                    </div>
                </div>
                <HiddenMenu>
                    <span onClick={handleOpen}>Edit Academic Record</span>
                    <span>Remove WorkPlace</span>
                </HiddenMenu>
            </div>
        )
    }

    if (!expanded) {
        return (
            <div className="about-expand" onClick={handleOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>
                Add Academic Record
            </div>
        )
    }

    return (
        <form className="about-form" onSubmit={handleSubmit}>
            <label>
                <input type="text" value={school} onChange={handleSchool} placeholder=" " required/>
                <div className="input-label">School</div>
            </label>
            <label className="not">
                <input className="checkbox" type="checkbox" checked={isCurrent} onChange={handleIsCurrent} placeholder=" "/>
                <div className="checkbox">I am currently studying here</div>
            </label>
            <div className="about-form-buttons">
                <div onClick={handleClose}>Cancel</div>
                <button>Save</button>
            </div>
        </form>
    )
}