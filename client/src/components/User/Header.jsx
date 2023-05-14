import { NavLink } from "react-router-dom"
import Edit from "./Edit/Edit"
export default function Header(props) {

    return (
        <header className="user-header">
            <div className="header-wrapper">

                <div className="cover">

                </div>
                <div className="user-info">
                    <div className="user-profile-pic">
                        <div className="user-profile-pic-wrapper">
                            <img src={props.profile} alt="" />
                        </div>
                    </div>
                    <div className="user-details">
                        <div className="user-name">{props.first_name} {props.last_name}</div>
                        <div className="user-friends-count">0 friends</div>
                        <div className="user-friends-pics">
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                            <div className="friend-pic"></div>
                        </div>
                    </div>

                    <div className="user-options">
                        <Edit />

                    </div>
                </div>
                <div className="user-routes">
                    <div className="user-routes-wrapper">
                        <NavLink to={'./'}>Posts</NavLink>
                        <NavLink to={'./about'}>About</NavLink>
                        <NavLink to={'./friends'}>Friends</NavLink>
                        <NavLink to={'./photos'}>Photos</NavLink>
                        <NavLink to={'./videos'}>Videos</NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}