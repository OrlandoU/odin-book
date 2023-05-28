import '../../assets/styles/Friends.css'
import { Route, Routes } from "react-router-dom";
import Home from './Routes/Home';
import Discover from './Routes/Discover';
import MyGroups from './Routes/MyGroups';
import Create from './Routes/Create';
import '../../assets/styles/Groups.css'
import Detail from './Detail/Detail';
import MainAside from './MainAside';

export default function Groups() {
    return (
        <main className="groups-main friends-main flex">
            <Routes>
                <Route path='/' element={<MainAside />} />
                <Route path='/discover' element={<MainAside />} />
                <Route path='/my-groups' element={<MainAside />} />
            </Routes>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/discover' element={<Discover />} />
                <Route path='/my-groups' element={<MyGroups />} />
                <Route path='/create' element={<Create />} />
                <Route path='/:groupId/*' element={<Detail />} />
            </Routes>
        </main>
    )
}