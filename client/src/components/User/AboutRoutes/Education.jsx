import { useContext } from "react";
import EducationForm from "../Forms/EducationForm";
import { UserContext } from "../../../contexts/UserContext";

export default function Education() {
    const user = useContext(UserContext)

    return (
        <div className="sub-route">
            <h3>College</h3>
            <EducationForm />
            {user.academics && user.academics.map(academic =>
                <EducationForm isPreview {...academic}/>
            )}
        </div>
    )
}