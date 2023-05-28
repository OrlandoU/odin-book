import Section from "../../Section";
import { NavLink } from "react-router-dom";

export default function Friend(props) {
    console.log(props)
    return (
        <div className="group-section-wrapper">
            <Section>
                <h2 className="sub-title">Friends</h2>
                {props.friends.length > 0 && <div className="group-media friend">
                    {props.friends.map(post =>
                        <div className="friend-route-user">
                            <NavLink to={'/' + post._id + '/'} key={post._id}>
                                <img src={post.profile} alt="Post media" />
                            </NavLink>
                            <div className="friend-route-name">
                                <NavLink to={'/' + post._id + '/'} className="friend-route-name-bit">
                                    {post.first_name} {post.last_name}
                                </NavLink>
                                <post className="post-data">{post.current_place}</post>
                            </div>
                        </div>
                    )}
                </div>}
            </Section>
        </div>
    )
}