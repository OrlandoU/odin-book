import User from "./User";

export default interface Group {
    _id: string,
    creator: string | User,
    name: string,
    create_date: Date,
    privacy: 'public' | 'private',
    last_active: string,
    cover: string,
    banned: string[] | User[]
}
