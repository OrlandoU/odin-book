import { Route, Routes } from "react-router-dom";
import Main from "./Routes/Main";
import FriendPhotos from "./Routes/FriendPhotos";
import PublicPhotos from "./Routes/PublicPhotos";

export default function Photos() {

    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/friends-groups" element={<FriendPhotos />} />
            <Route path="/public" element={<PublicPhotos />} />
        </Routes>
    )
}