import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface Token {
    token: string,
    setToken: Dispatch<SetStateAction<string>>
}

export const TokenContext = createContext<Token | null>(null)
