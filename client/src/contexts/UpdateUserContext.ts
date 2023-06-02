import { createContext } from "react";

export const UpdateUserContext = createContext<((token: string) => void) | null>(null)