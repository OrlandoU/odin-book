import { useContext } from "react"
import { UserContext } from "../../../contexts/UserContext"
import JobForm from "../Forms/JobForm"
import EducationForm from "../Forms/EducationForm"
import BirthPlaceForm from "../Forms/BirthPlaceForm"
import CurrentPlaceForm from "../Forms/CurrentPlaceForm"

export default function Overview(){
    const user = useContext(UserContext)

    return (
        <div className="sub-route">
            {user.jobs && user.jobs.map(job =>
                <JobForm isPreview {...job} />
            )}
            {user.academics && user.academics.map(academic =>
                <EducationForm isPreview {...academic} />
            )}
            <BirthPlaceForm place={user.birth_place} isPreview={user.birth_place ? true : false} />
            <CurrentPlaceForm place={user.current_place} isPreview={user.current_place ? true : false} />
        </div>
    )
}