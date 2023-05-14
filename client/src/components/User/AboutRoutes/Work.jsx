import { useContext } from "react";
import JobForm from "../Forms/JobForm";
import { UserContext } from '../../../contexts/UserContext'

export default function Work() {
    const user = useContext(UserContext)

    return (
        <div className="sub-route">
            <h3>Jobs</h3>
            <JobForm />
            {user.jobs && user.jobs.map(job =>
                <JobForm isPreview {...job}/>
            )}
        </div>
    )
}