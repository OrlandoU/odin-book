import Chats from "./NavOptions/Chats";
import Notifications from "./NavOptions/Notifications";
import UserOption from "./NavOptions/UserOption";

interface Props{
    setIsDarkMode: (val: boolean) => void,
    setIsCompact: (val: boolean) => void,
    isCompact: boolean,
    isDarkMode: boolean
}

export default function NavOptions(props: Props): JSX.Element {
    return (
        <div className="nav-options">
            <Chats />
            <Notifications />            
            <UserOption {...props}/>
        </div>
    )
}