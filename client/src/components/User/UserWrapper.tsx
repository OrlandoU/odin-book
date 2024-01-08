import User from "./User";
import { useParams } from "react-router-dom";

export default function UserWrapper() {
    const url = useParams()

    return <User key={url.userId}/>
}