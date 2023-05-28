import '../../assets/styles/Search.css'
import { Route, Routes } from "react-router-dom";
import MainAside from './MainAside';
import '../../assets/styles/Groups.css'
import Home from './Routes/Home';
import Users from './Routes/Users';
import Posts from './Routes/Posts';
import Photos from './Routes/Photos';
import Groups from './Routes/Groups';

export default function Search() {
    return (
        <main className="search-main friends-main flex">
            <MainAside />
            <Routes>
                <Route path='/all' element={<Home />} />
                <Route path='/posts' element={<Posts />}/>
                <Route path='/photos/*' element={<Photos />}/>
                <Route path='/people' element={<Users />}/>
                <Route path='/groups' element={<Groups />} />
            </Routes>
        </main>
    )
}