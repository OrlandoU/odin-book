import '../../assets/styles/Friends.css'
import {  Route, Routes } from "react-router-dom";
import Home from './Routes/Home';
import Birthdays from './Routes/Birthdays';
import MainAside from './MainAside';
import AllFriends from './Routes/AllFriends';
import FriendRequest from './Routes/FriendRequests';
import Suggestions from './Routes/Suggestions';
export default function Friends() {

    return (
        <main className="friends-main flex">
            <Routes>
                <Route path='/' element={<MainAside />} />
                <Route path='/birthdays' element={<MainAside />} />
            </Routes>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/list/*' element={<AllFriends />} />
                <Route path='/suggestions/*' element={<Suggestions />} />
                <Route path='/requests/*' element={<FriendRequest />} />                
                <Route path='/birthdays' element={<Birthdays />}/>
            </Routes>
        </main>
    )
}