import { createContext } from "react";
import Chat from "../interfaces/Chat";

export interface ChatContI {
    openChats: Chat[],
    addChat: (chat: Chat) => void, 
    removeChat: (id: string) => void, 
    hideChat: (id: string) => void, 
    showChat: (id: string) => void
}

export const ChatContext = createContext<ChatContI | null>(null)