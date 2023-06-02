import User from "./User";

export default interface Reaction {
    _id: string,
    parent_id: string,
    user_id: string | User,
    type: 'like' | 'angry' | 'care' | 'haha' | 'love' | 'sad' | 'wow',
    parent_collection: 'post' | 'comment'
}