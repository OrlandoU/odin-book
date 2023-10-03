import Comment from "./Comment";
import Group from "./Group";
import Post from "./Post";
import Reaction from "./Reaction";
import Relationship from "./Relationship";
import User from "./User";

export default interface Notification {
    _id?: string,
    user_id?: string | User,
    type: string,
    sender_id?: string | User,
    post?: string | Post,
    comment?: string | Comment,
    reaction?: string | Reaction,
    create_date?: Date,
    request?: string | Relationship,
    isViewed?: boolean,
    isVisited?: boolean,
    group?: string | Group
}