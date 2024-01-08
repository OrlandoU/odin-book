import User from "../../../interfaces/User";
import Section from "../../Section";
import { NavLink } from "react-router-dom";

export default function Friend(props: {friends: User[]}): JSX.Element {
    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Friends</h2>
                {props.friends.length > 0 && <div className="group-media friend">
                    {props.friends.map(friend =>
                        <div className="post-route-user">
                            <NavLink to={'/' + friend._id + '/'} key={friend._id}>
                                <img src={friend.profile} alt="Post media" />
                            </NavLink>
                            <div className="post-route-name">
                                <NavLink to={'/' + friend._id + '/'} className="friend-route-name-bit">
                                    {friend.first_name} {friend.last_name}
                                </NavLink>
                                <div className="post-data">{friend.current_place}</div>
                            </div>
                        </div>
                    )}
                </div>}
            </Section>
        </div>
    )
}