import mongoose, { Document, ObjectId, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface PostInterface extends Document {
    _id: Types.ObjectId,
    content: string,
    user_id: Types.ObjectId,
    media: string,
    multiple_media: string[],
    group: Types.ObjectId,
    mentions: Types.ObjectId[],
    isInTrash: boolean,
    type: 'normal' | 'profile' | 'cover' | 'group-create' | 'group-cover' | 'birth',
    scope: 'public' | 'friends' | 'me' | 'group',
    create_date: Date,
    saved: Types.ObjectId[]
}

const PostSchema = new Schema({
    content: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String },
    multiple_media: [{ type: String }],
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isInTrash: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ['normal', 'profile', 'cover', 'group-create', 'group-cover', 'birth'],
        default: 'normal'
    },
    scope: {
        type: String,
        enum: ['public', 'friends', 'me', 'group'],
        default: 'public'
    },
    create_date: { type: Schema.Types.Date, default: Date.now },
    saved: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export default mongoose.model<PostInterface>('Post', PostSchema)