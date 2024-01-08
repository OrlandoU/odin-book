import { useContext } from "react";
import JobForm from "../Forms/JobForm";
import { UserContext } from '../../../contexts/UserContext'
import User from "../../../interfaces/User";

export default function Work() {
    const user = useContext(UserContext) as User

    return (
        <div className="sub-route">
            <h3>Jobs</h3>
            <JobForm />
            {user.jobs && user.jobs.map(job =>
                typeof job !== 'string' && <JobForm isPreview {...job}/>
            )}
        </div>
    )
}