import { NavLink } from "react-router-dom";
import Aside from "../../Aside";

export default function FriendRequest() {
    return (
        <>
            <Aside>
                <h2>
                    <NavLink to={'/friends'}>
                        <div className="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                        </div>
                    </NavLink>
                    Friend Requests
                </h2>
            </Aside>
        </>
    )
}