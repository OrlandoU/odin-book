import { KeyboardEventHandler, useCallback, useContext, useEffect, useState } from "react";
import ChatPreview from "../ChatPreview";
import NavModal from "../NavModal";
import { SocketContext } from "../../../contexts/SocketContext";
import { ChatContI, ChatContext } from "../../../contexts/ChatContext";
import { UserContext } from "../../../contexts/UserContext";
import { createChat, getChatWithUser, getChats, getUnviewedChats } from "../../../functions/chat";
import { Token, TokenContext } from "../../../contexts/TokenContext";
import new_message from '../../../assets/sounds/new_message.mp3'
import useSound from "use-sound";
import { queryUser } from "../../../functions/user";
import React from "react";
import User from "../../../interfaces/User";
import { Socket } from "socket.io-client";
import Chat from "../../../interfaces/Chat";
import Message from "../../../interfaces/Message";

export default function Chats(): JSX.Element {

    const user = useContext(UserContext) as User
    const socket = useContext(SocketContext) as Socket
    const { openChats, addChat } = useContext(ChatContext) as ChatContI
    const { token } = useContext(TokenContext) as Token

    const [content, setContent] = useState<string>('')
    const [chats, setChats] = useState<Chat[]>([])
    const [unviewedChats, setUnviewedChats] = useState<Chat[]>([])
    const [users, setUsers] = useState<User[]>([])

    const [playMessageAudio] = useSound(new_message)

    const handleReturn = () => {
        setUsers([])
    }

    const handleInput: KeyboardEventHandler<HTMLInputElement> = (e) => {
        const target = e.target as HTMLInputElement
        setContent(target.value)
        if (target.value.length > 0) {
            queryUser(token, target.value)
                .then(value => value && setUsers(value))
        } else {
            setUsers([])
        }
    }

    const handleQueriedUser = async (user: User) => {
        const chat = await getChatWithUser(token, user._id) as Chat
        if (!chat) {
            const newChat = await createChat(token, user._id) as Chat
            setContent('')
            addChat(newChat)
        } else {
            setContent('')
            addChat(chat)
        }
        document.body.click()
    }

    const handleOpenMessages = () => {
        setUnviewedChats([])
    }

    const handleSocket = useCallback(() => {
        const newMessageHandler = (message: Message) => {
            if (typeof message.user_id !== 'string' && message.user_id._id !== user._id && !openChats.find(chat => (message.chat_id === chat._id && chat.open))) {
                playMessageAudio()
                getUnviewedChats(token).then((value) => {
                    setUnviewedChats(value || []);
                });
                getChats(token).then(value => {
                    value && setChats(value)
                })
            }
        };


        return { newMessageHandler }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openChats, user._id, token])

    useEffect(() => {
        if (socket.on) {
            const { newMessageHandler } = handleSocket()

            // Register the event listeners
            socket.on('new_message', newMessageHandler);

            // Clean up the event listeners when the component unmounts or when the dependencies change
            return () => {
                socket.off('new_message', newMessageHandler);
            };
        }
    }, [handleSocket, socket]);

    useEffect(() => {
        getChats(token).then(value => {
            value && setChats(value)
        })

        getUnviewedChats(token).then(value => {
            setUnviewedChats(value || [])
        })
    }, [token, openChats])


    return (
        <NavModal isDisplayNone onVisible={handleOpenMessages} count={unviewedChats.length} svg={<svg viewBox="0 0 28 28" className="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0" fill="currentColor" height="20" width="20"><path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path></svg>}>
            <h2>Chats</h2>
            <div className="input-wrapper">
                <svg style={content.length > 0 || users.length > 0 ? { display: 'block' } : {}} onClick={handleReturn} className="return-queried" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>
                <input type="text" placeholder="Search in Messenger" onInput={handleInput} value={content} />
                <svg style={content.length > 0 || users.length > 0 ? { display: 'none' } : {}} fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em" className="x1lliihq x1k90msu x2h7rmj x1qfuztq xcza8v6 xlup9mm x1kky2od"><g fill-rule="evenodd" transform="translate(-448 -544)"><g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)"></path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z" transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)"></path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)"></path></g></g></svg>
            </div>
            {content.length > 0 && < div className="queried-users-wrapper">
                {users.map(user =>
                    <div className="queried-user-small" onClick={() => handleQueriedUser(user)}>
                        <div className="queried-user-img"><img src={user.profile} alt="" /></div>
                        <div className="queried-user-name">{user.first_name} {user.last_name}</div>
                    </div>
                )}
            </div>}
            <div className="chats-wrapper" style={content.length > 0 ? { display: 'none' } : {}}>
                {chats.map((chat) =>
                    <ChatPreview {...chat} key={chat._id} />
                )}
            </div>
        </NavModal >
    )
}