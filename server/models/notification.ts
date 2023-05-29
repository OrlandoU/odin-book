import mongoose, { Document, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface NotificationInterface extends Document {
    user_id?: Types.ObjectId,
    type: string,
    sender_id?: Types.ObjectId,
    post: Types.ObjectId,
    comment: Types.ObjectId,
    reaction: Types.ObjectId,
    create_date: Date,
    request: Types.ObjectId,
    isViewed: boolean,
    isVisited: boolean
}

const NotificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, enum: ['comment', 'reply', 'tag', 'comment_mention', 'post_mention', 'request', 'post', 'post_reaction', 'comment_reaction', 'invitation'] },
    sender_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    reaction: { type: Schema.Types.ObjectId, ref: 'Reaction' },
    create_date: { type: Date, default: Date.now },
    request: { type: Schema.Types.ObjectId, ref: 'Relationship' },
    isViewed: { type: Boolean, default: false },
    isVisited: { type: Boolean, default: false }
})

export default mongoose.model<NotificationInterface>('Notification', NotificationSchema)