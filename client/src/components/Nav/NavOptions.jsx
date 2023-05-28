import Chats from "./NavOptions/Chats";
import Notifications from "./NavOptions/Notifications";
import UserOption from "./NavOptions/UserOption";



export default function NavOptions(props) {
    return (
        <div className="nav-options">
            <Chats />
            <Notifications />            
            <UserOption {...props}/>
        </div>
    )
}