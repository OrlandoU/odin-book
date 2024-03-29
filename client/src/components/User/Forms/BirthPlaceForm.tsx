import { ChangeEventHandler, FormEventHandler, MouseEventHandler, useContext, useState } from "react";
import HiddenMenu from "../../HiddenMenu";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import { UpdateUserContext } from "../../../contexts/UpdateUserContext";
import { updateUser } from "../../../functions/user";

interface Props {
    place: string,
    isPreview: boolean
}

export default function BirthPlaceForm(props: Props) {
    const userUpdate = useContext(UpdateUserContext) as (token: string) => void
    const { token } = useContext(TokenContext) as Token
    const [expanded, setExpanded] = useState<boolean>(false)
    const [place, setPlace] = useState(props.place || '')

    const handleClose = () => {
        setPlace('')
        setExpanded(false)
    }

    const handleOpen: MouseEventHandler = () => {
        setExpanded(true)
    }

    const handlePlace: ChangeEventHandler = (e) => {
        let target = e.target as HTMLInputElement
        setPlace(target.value)
    }

    const handleRemove: MouseEventHandler = (e) => {
        updateUser(token, '').then(() => {
            userUpdate(token)
            handleClose()
        })
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        updateUser(token, place).then(() => {
            userUpdate(token)
            handleClose()
        })
    }

    if (props.isPreview && !expanded) {
        return (
            <div className="about-preview">
                <div className="preview-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>map-marker-radius</title><path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z" /></svg>
                </div>
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
                    <span onClick={handleRemove}>Remove Hometown</span>
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
                <input type="text" value={place} onChange={handlePlace} placeholder=" " required />
                <div className="input-label">Hometown</div>
            </label>
            <div className="about-form-buttons">
                <div onClick={handleClose}>Cancel</div>
                <button>Save</button>
            </div>
        </form>
    )
}