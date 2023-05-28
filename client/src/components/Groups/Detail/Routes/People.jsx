import { useContext, useEffect, useState } from "react";
import Section from "../../../Section";
import { TokenContext } from "../../../../contexts/TokenContext";
import { useParams } from "react-router-dom";
import { getGroupMembers } from "../../../../functions/group";
import Preview from "../../../Friends/Preview";

export default function People(props) {
    const url = useParams()
    const { token } = useContext(TokenContext)
    const [members, setMembers] = useState([])

    useEffect(() => {
        getGroupMembers(token, url.groupId).then(value => setMembers(value))
    }, [url.groupId])

    console.log(props)

    return (
        <div className="profile-edit" style={{ margin: '16px auto' }}>
            <Section className={'group'}>
                <h2 className="sub-title">Members <span>· {members.length}</span></h2>
                <div className="post-data">New people who join this group will appear here.</div>
                <div className="border-line"></div>
                <div className="group-preview-name">Admins · 1</div>
                <Preview {...props.creator} unwrapped residence />
                <div className="border-line"></div>
                <div className="group-preview-name">Members · {members.length}</div>
                {members.map(member =>
                    <Preview {...member} unwrapped residence key={member._id} />
                )}
            </Section>
        </div>
    )
}