import { useContext } from "react";
import BirthPlaceForm from "../Forms/BirthPlaceForm";
import CurrentPlaceForm from "../Forms/CurrentPlaceForm";
import { UserContext } from "../../../contexts/UserContext";
import User from "../../../interfaces/User";

export default function Places() {
    const user = useContext(UserContext) as User

    return (
        <div className="sub-route">
            <h3>Places lived</h3>
            <BirthPlaceForm place={user.birth_place} isPreview={user.birth_place ? true : false} />
            <CurrentPlaceForm place={user.current_place} isPreview={user.current_place ? true : false} />
        </div>
    )
}