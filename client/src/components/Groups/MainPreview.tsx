import { MouseEventHandler, useContext, useEffect, useState } from "react"
import {  getGroupMembersCount, joinGroup } from "../../functions/group"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { NavLink } from "react-router-dom"
import Group from "../../interfaces/Group"

interface Props extends Group{
    myGroups?: Group[]
}

export default function MainPreview(props: Props): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const [members, setMembers] = useState<number>(0)

    const handleJoinGroup: MouseEventHandler = async (e) => {
        e.stopPropagation()
        const response = joinGroup(token, props._id)
        console.log(response)
    }

    useEffect(() => {
        getGroupMembersCount(token, props._id).then((value) => value && setMembers(value))
    }, [props._id, token])

    if (props.myGroups) {
        return (
            <div className="main-group-preview mine">
                <div className="main-group-content mine">
                    <div className="main-group-cover mine">
                        <img src={props.cover} alt="" />
                    </div>
                    <div className="main-group-data mine">
                        <div className="group-name">{props.name}</div>
                        <div className="group-metadata">{members} members</div>
                    </div>

                </div>
                <div className="main-group-buttons">
                    <NavLink to={'/groups/' + props._id + '/'} className="group-create-link">View Group</NavLink>
                    <div className="user-option">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>dots-horizontal</title><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <NavLink to={'/groups/' + props._id + '/'} className="main-group-preview">
            <div className="main-group-cover">
                <img src={props.cover} alt="" />
            </div>
            <div className="main-group-content">
                <div className="main-group-data">
                    <div className="group-name">{props.name}</div>
                    <div className="group-metadata">{members} members</div>
                </div>
                <div className="main-group-buttons">
                    <div className="user-option" onClick={handleJoinGroup}>
                        Join Group
                    </div>
                </div>
            </div>
        </NavLink>
    )
}