import { createContext } from "react";

export const UpdateUserContext = createContext<((token: JsonWebKey) => void) | null>(null)