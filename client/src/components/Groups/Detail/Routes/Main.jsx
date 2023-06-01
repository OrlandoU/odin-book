import { Route, Routes } from "react-router-dom";
import MainRoute from "./MainRoute";
import PostDisplay from "./PostDisplay";


export default function Main(props) {


    return (
        <Routes>
            <Route path='/' element={<MainRoute {...props} />} />
            <Route path="/:postId" element={<PostDisplay {...props} />} />
        </Routes>
    )
}