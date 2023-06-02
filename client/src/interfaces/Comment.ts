import User from "./User";

export default interface Comment {
    _id: string,
    user_id: string | User[],
    post_id: string,
    parent_comment: string,
    content: string,
    media: string,
    mentions: string[] | User[],
    create_date: Date
}
