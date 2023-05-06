import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { NavLink } from "react-router-dom"

export default function LeftBar() {
    const user = useContext(UserContext)

    console.log(user)
    return (
        <aside className="left-aside">
            <section className="capitalize">
                <NavLink to={'/'} className="section-item">
                    <div className="section-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height='20px' width='20px'><title>home</title><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg>
                    </div>
                    <div className="section-text">Home</div>
                </NavLink>
                <NavLink to={'/' + user._id} className="section-item">
                    <div className="section-icon"></div>
                    <div className="section-text">{user.first_name} {user.last_name}</div>
                </NavLink>
            </section>
            <section className="groups-list">
                {user.groups && user.groups.map(group =>
                    <div className="group section-item">
                        <div className="group-profile"></div>
                        <div className="group-name">{group.name}</div>
                    </div>
                )}
            </section>
        </aside>
    )
}