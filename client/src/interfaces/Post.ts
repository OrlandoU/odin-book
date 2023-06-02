import Group from "./Group";
import User from "./User";

export default interface Post {
    _id: string,
    content: string,
    user_id: string | User,
    media: string,
    multiple_media: string[],
    group: string | Group,
    mentions: string[] | User[],
    isInTrash: boolean,
    type: 'normal' | 'profile' | 'cover' | 'group-create' | 'group-cover' | 'birth',
    scope: 'public' | 'friends' | 'me' | 'group',
    create_date: Date,
    saved: string[] | User[]
}