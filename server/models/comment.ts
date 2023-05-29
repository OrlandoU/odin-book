import mongoose, { Document, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface CommentInterface extends Document {
    user_id: Types.ObjectId,
    post_id: Types.ObjectId,
    parent_comment: Types.ObjectId,
    content: string,
    media: string,
    mentions: Types.ObjectId[],
    create_date: Date
}

const CommentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    parent_comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content: { type: String },
    media: { type: String },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    create_date: { type: Date, default: Date.now }
})

export default mongoose.model<CommentInterface>('Comment', CommentSchema)