import User from "./User";

export default interface Message {
    _id: string,
    chat_id: string,
    user_id: string | User,
    isFirst: boolean,
    content: string,
    isRead: boolean,
    isViewed: boolean,
    create_date: Date,
    media: string,
    removed: string[] | User[],
    isUnsent: boolean
}