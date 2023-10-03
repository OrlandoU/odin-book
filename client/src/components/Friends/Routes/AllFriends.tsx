import { NavLink, Route, Routes } from "react-router-dom";
import Aside from "../../Aside";
import { useContext, useEffect, useState } from "react";
import { getFriends } from '../../../functions/relationship'
import { Token, TokenContext } from '../../../contexts/TokenContext'
import User from '../../User/User'
import Preview from "../Preview";
import { UserContext } from "../../../contexts/UserContext";
import Relationship from "../../../interfaces/Relationship";
import UserI from "../../../interfaces/User";

export default function AllFriends(): JSX.Element {
    const { token } = useContext(TokenContext) as Token
    const user: UserI | null = useContext(UserContext)
    const [friends, setFriends] = useState<Relationship[]>([])

    useEffect(() => {
        if(user){
            getFriends(token, user._id).then(value => {
                setFriends(value || [])
            })
        }
    }, [user, token])

    return (
        <>
            <Aside>
                <h2>
                    <NavLink to={'/friends/'}>
                        <div className="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                        </div>
                    </NavLink>
                    <div>
                        <p className="smaller">Friends</p>
                        All Friends
                    </div>
                </h2>
                {friends.map(friend =>
                    <Preview relationship={friend} key={friend._id}/>
                )}
            </Aside>
            <Routes>
                <Route path='/:userId/*' element={<User />} />
            </Routes>
        </>
    )
}