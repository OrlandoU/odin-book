import { NavLink, Route, Routes } from "react-router-dom";
import Aside from "../../Aside";
import { useContext, useEffect, useState } from "react";
import { getFriendRequests } from "../../../functions/relationship";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import Preview from "../Preview";
import User from "../../User/User";
import Relationship from "../../../interfaces/Relationship";

export default function FriendRequest(): JSX.Element {
    const { token } = useContext(TokenContext) as Token

    const [friends, setFriends] = useState<Relationship[]>([])

    useEffect(() => {
        getFriendRequests(token).then(value => {
            if(Array.isArray(value)){
                setFriends(value)
            }
        })
    }, [token])

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
                        Friend Requests
                    </div>

                </h2>
                {friends.map(friend =>
                    <Preview relationship={friend} key={friend._id} friendsInCommon requests/>
                )}
            </Aside>
            <Routes>
                <Route path='/:userId/*' element={<User />} />
            </Routes>
        </>
    )
}