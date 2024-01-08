import { useContext } from "react";
import EducationForm from "../Forms/EducationForm";
import { UserContext } from "../../../contexts/UserContext";
import User from "../../../interfaces/User";

export default function Education() {
    const user = useContext(UserContext) as User

    return (
        <div className="sub-route">
            <h3>College</h3>
            <EducationForm />
            {user.academics && user.academics.map(academic =>
             typeof academic !== 'string' && <EducationForm isPreview {...academic}/>
            )}
        </div>
    )
}