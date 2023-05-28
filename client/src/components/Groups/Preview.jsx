import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getGroupMembers } from "../../functions/group";
import { TokenContext } from "../../contexts/TokenContext";

export default function Preview(props) {

    return (
        <NavLink to={`/groups/${props._id}/`} className="group-preview">
            <div className="group-preview-pic">
                <img src={props.cover} alt="" />
            </div>
            <div className="group-preview-data">
                <div className="group-preview-name">{props.name}</div>
                {!props.isExpanded ?
                    <div className="group-preview-last">{ }</div> :
                    <div className="group-preview-detail">{props.privacy === 'public' ? 'Public Group' : 'Private Group'} <strong>{props.members.length} {props.members.length !== 1 ? 'members': 'member'}</strong></div>
                }

            </div>
        </NavLink>
    )
}