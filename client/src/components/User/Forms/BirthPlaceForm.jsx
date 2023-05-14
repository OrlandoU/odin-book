import { useContext, useState } from "react";
import HiddenMenu from "../../HiddenMenu";
import { updateUser } from "../../../functions/user";
import { TokenContext } from "../../../contexts/TokenContext";

export default function BirthPlaceForm(props) {
    const token = useContext(TokenContext).token
    const [expanded, setExpanded] = useState(false)
    const [place, setPlace] = useState(props.place || '')

    const handleClose = () => {
        setPlace('')
        setExpanded(false)
    }

    const handleOpen = () => {
        setExpanded(true)
    }

    const handlePlace = (e) => {
        setPlace(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateUser(token, place)
    }

    if (props.isPreview && !expanded) {
        return (
            <div className="about-preview">
                <div className="preview-icon"></div>
                <div className="preview-data">
                    <div className="preview-data-top">
                        {props.place}
                    </div>
                    <div className="preview-data-bottom">
                        Hometown
                    </div>
                </div>
                <HiddenMenu>
                    <span onClick={handleOpen}>Edit Hometown</span>
                    <span>Remove Hometown</span>
                </HiddenMenu>
            </div>
        )
    }


    if (!expanded) {
        return (
            <div className="about-expand" onClick={handleOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>
                Add hometown
            </div>
        )
    }

    return (
        <form className="about-form" onSubmit={handleSubmit}>
            <label>
                <input type="text" value={place} onChange={handlePlace} placeholder=" " required/>
                <div className="input-label">Hometown</div>
            </label>
            <div className="about-form-buttons">
                <div onClick={handleClose}>Cancel</div>
                <button>Save</button>
            </div>
        </form>
    )
}