/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Section from "../../../Section";
import { Token, TokenContext } from "../../../../contexts/TokenContext";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../../../../functions/group";
import Preview from "../../../Friends/Preview";
import User from "../../../../interfaces/User";

interface Props {
    creator : User | string
}

export default function People(props: Props): JSX.Element {
    const url = useParams()
    const { token } = useContext(TokenContext) as Token
    const [members, setMembers] = useState<User[]>([])

    useEffect(() => {
        if(!url.groupId) return
        getGroupMembers(token, url.groupId).then(value => value && setMembers(value))
    }, [url.groupId])

    return (
        <div className="profile-edit" style={{ margin: '16px auto' }}>
            <Section className={'group'}>
                <h2 className="sub-title">Members <span>· {members.length}</span></h2>
                <div className="post-data">New people who join this group will appear here.</div>
                <div className="border-line"></div>
                <div className="group-preview-name">Admins · 1</div>
                {typeof props.creator !== 'string' && <Preview {...props.creator} unwrapped residence />}
                <div className="border-line"></div>
                <div className="group-preview-name">Members · {members.length}</div>
                {members.map(member =>
                    <Preview {...member} unwrapped residence key={member._id} />
                )}
            </Section>
        </div>
    )
}