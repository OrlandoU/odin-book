import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { NavLink, useLocation } from "react-router-dom"

export default function LeftBar() {
    const location = useLocation()
    const user = useContext(UserContext)

    return (
        <aside className={location.pathname !== '/' ? "left-aside not-home": "left-aside"}>
            <section className="capitalize">
                <NavLink to={'/'} className="section-item">
                    <div className="section-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height='20px' width='20px'><title>home</title><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg>
                    </div>
                    <div className="section-text">Home</div>
                </NavLink>
                <NavLink to={'/' + user._id + '/'} className="section-item">
                    <div className="section-icon">
                        <img src={user.profile} alt="User profile" />
                    </div>
                    <div className="section-text">{user.first_name} {user.last_name}</div>
                </NavLink>
            </section>
            <section className="middle-section">
                <NavLink to={'/friends'} className='section-item'>
                    <div className="section-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-multiple</title><path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" /></svg>
                    </div>
                    <div className="section-text">
                        Friends
                    </div>
                </NavLink>
                <NavLink to={'/groups'} className='section-item'>
                    <div className="section-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-group</title><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" /></svg>
                    </div>
                    <div className="section-text">Groups</div>
                </NavLink>
                <NavLink to={'/saved'} className='section-item'>
                    <div className="section-svg saved">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bookmark</title><path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" /></svg>
                    </div>
                    <div className="section-text">Saved</div>
                </NavLink>
            </section>
            <section className="groups-list">
                {user.groups && user.groups.map(group =>
                    <NavLink to={'/groups/' + group._id + '/'} key={group._id} className="group section-item">
                        <div className="group-profile">
                            <img src={group.cover} alt="" />
                        </div>
                        <div className="group-name">{group.name}</div>
                    </NavLink>
                )}
            </section>
        </aside>
    )
}