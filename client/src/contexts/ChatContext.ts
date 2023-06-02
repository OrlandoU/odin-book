import { createContext } from "react";
import Chat from "../interfaces/Chat";

export const ChatContext = createContext<Chat | null>(null)