import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getGroupMembersCount } from "../../functions/group";
import { TokenContext } from "../../contexts/TokenContext";

export default function Preview(props) {
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [memberCount, setMemberCount] = useState({})

    useEffect(() => {
        if (props.isExpanded) {
            getGroupMembersCount(token, url.groupId).then(value=>setMemberCount(value))
        }
    }, [url.groupId])

    console.log(memberCount)
    return (
        <NavLink to={`/groups/${props._id}/`} className="group-preview">
            <div className="group-preview-pic">

            </div>
            <div className="group-preview-data">
                <div className="group-preview-name">{props.name}</div>
                {!props.isExpanded ?
                    <div className="group-preview-last">{ }</div> :
                    <div className="group-preview-detail">{props.privacy === 'public' ? 'Public Group' : 'Private Group'} <strong>{memberCount.count} {memberCount.count > 1 ? 'members': 'member'}</strong></div>
                }

            </div>
        </NavLink>
    )
}