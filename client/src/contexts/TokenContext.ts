import { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface Token {
    token: JsonWebKey, 
    setToken: Dispatch<SetStateAction<JsonWebKey | null>>
}

export const TokenContext = createContext<Token | null>(null)
