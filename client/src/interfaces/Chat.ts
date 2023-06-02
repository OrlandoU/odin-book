import User from "./User";

export default interface Chat {
    _id: string,
    participants: User[],
    isGroup: boolean,
    lastActive: Date,
    open: boolean
}
