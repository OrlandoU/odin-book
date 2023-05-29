import mongoose, { Document, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface MessageInterface extends Document {
    chat_id: Types.ObjectId,
    user_id: Types.ObjectId,
    isFirst: boolean,
    content: string,
    isRead: boolean,
    isViewed: boolean,
    create_date: Date,
    media: string,
    removed: Types.ObjectId[],
    isUnsent: boolean
}

const MessageSchema = new Schema({
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isFirst: { type: Boolean, default: false },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    create_date: { type: Date, default: Date.now },
    media: { type: String },
    removed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isUnsent: { type: Boolean, default: false }
})

export default mongoose.model<MessageInterface>('Message', MessageSchema)