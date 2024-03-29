import { ChangeEventHandler, FormEventHandler, ReactNode, useContext, useState } from "react";
import HiddenMenu from "../../HiddenMenu";
import { createUserAcademic, deleteUserAcademic, updateUserAcademic } from "../../../functions/user";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import { UpdateUserContext } from "../../../contexts/UpdateUserContext";

interface Props{
    isPreview?: boolean,
    location?: ReactNode;
    _id?: string,
    school?: string,
    is_current?: boolean
}

export default function EducationForm(props:Props) {
    const updateUser = useContext(UpdateUserContext)
    const {token} = useContext(TokenContext) as Token
    const [expanded, setExpanded] = useState<boolean>(false)
    const [school, setSchool] = useState<string>(props.school || '')
    const [isCurrent, setIsCurrent] = useState<boolean>(props.is_current === undefined ? false: props.is_current)

    const handleClose = () => {
        setSchool('')
        setIsCurrent(false)
        setExpanded(false)
    }

    const handleOpen = () => {
        setExpanded(true)
    }

    const handleSchool: ChangeEventHandler = (e) => {
        let target = e.target as HTMLInputElement
        setSchool(target.value)
    }

    const handleIsCurrent: ChangeEventHandler = (e) => {
        let target = e.target as HTMLInputElement
        setIsCurrent(target.checked)
    }

    const handleRemove = () => {
        props._id && deleteUserAcademic(token, props._id).then(() => {
            updateUser && updateUser(token)
        })
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        if (props.isPreview) {
            props._id && updateUserAcademic(token, props._id, school, isCurrent).then(() => {
                updateUser && updateUser(token)
                handleClose()
            })
        } else {
            createUserAcademic(token, school, isCurrent)
                .then(() => {
                    updateUser && updateUser(token)
                    handleClose()
                })
        }
    }

    if (props.isPreview && !expanded) {
        return (
            <div className="about-preview">
                <div className="preview-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>school</title><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
                </div>
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
                    <span onClick={handleRemove}>Remove WorkPlace</span>
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
                <input type="text" value={school} onChange={handleSchool} placeholder=" " required />
                <div className="input-label">School</div>
            </label>
            <label className="not">
                <input className="checkbox" type="checkbox" checked={isCurrent} onChange={handleIsCurrent} placeholder=" " />
                <div className="checkbox">I am currently studying here</div>
            </label>
            <div className="about-form-buttons">
                <div onClick={handleClose}>Cancel</div>
                <button>Save</button>
            </div>
        </form>
    )
}