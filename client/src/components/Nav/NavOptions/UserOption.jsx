import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"
import NavModal from "../NavModal"

export default function UserOption(props){
    const user = useContext(UserContext)

    const handleDarkMode = (e) => {
        if (e.target.value === 'on') {
            props.setIsDarkMode(true)
        } else {
            props.setIsDarkMode(false)
        }
    }

    const handleCompactMode = (e) => {
        if (e.target.value === 'on') {
            props.setIsCompact(true)
        } else {
            props.setIsCompact(false)
        }
    }

    return (
        <NavModal
            svg={<div className="nav-svg user">
                <img src={user.profile} alt="" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
            </div>}>
            <div className="nav-user">
                <div className="nav-user-img">
                    <img src={user.profile} alt="Nav user" />
                </div>
                <div className="nav-user-name">{user.first_name} {user.last_name}</div>
            </div>
            <NavModal isNested
                close={<div className="close-nav-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                    Display & accessibility
                </div>}
                svg={<div className="nav-user-option" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-night</title><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>
                    Display & accessibility
                    <svg style={{ marginLeft: 'auto', backgroundColor: 'transparent' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
                </div>}>
                <div className="nav-user-option not-highlight">
                    <svg style={{ alignSelf: 'flex-start', marginTop: '6px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waning-crescent</title><path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>
                    <div className="nav-text">
                        <div className="nav-user-name">Dark mode</div>
                        <div className="post-data">
                            Adjust the appearance of Facebook to reduce glare and give your eyes a break.
                        </div>
                        <label className="nav-user-option-input">
                            Off
                            <input type="radio" name="theme-mode" checked={!props.isDarkMode} value={'off'} onChange={handleDarkMode} />
                        </label>
                        <label className="nav-user-option-input">
                            On
                            <input type="radio" name="theme-mode" checked={props.isDarkMode} value={'on'} onChange={handleDarkMode} />
                        </label>
                    </div>
                </div>
                <div className="nav-user-option not-highlight">
                    <svg style={{ alignSelf: 'flex-start', marginTop: '6px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>moon-waning-crescent</title><path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>
                    <div className="nav-text">
                        <div className="nav-user-name">Compact Mode</div>
                        <div className="post-data">
                            Make your font size smaller so more content can fit on the screen.
                        </div>
                        <label className="nav-user-option-input">
                            Off
                            <input type="radio" name="compact-mode" checked={!props.isCompact} value={'off'} onChange={handleCompactMode} />
                        </label>
                        <label className="nav-user-option-input">
                            On
                            <input type="radio" name="compact" checked={props.isCompact} value={'on'} onChange={handleCompactMode} />
                        </label>
                    </div>
                </div>
            </NavModal>
            <div className="nav-user-option">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>logout</title><path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" /></svg>
                Logout
            </div>
        </NavModal>
    )
}