import mongoose, { Document, ObjectId } from 'mongoose'
const Schema = mongoose.Schema

export interface PostInterface extends Document{
    _id: ObjectId,
    content: string,
    user_id: ObjectId,
    media: string,
    multiple_media: string[],
    group: ObjectId,
    mentions: ObjectId[],
    isInTrash: boolean,
    type: 'normal' | 'profile' | 'cover' | 'group-create' | 'group-cover' | 'birth',
    scope: 'public' | 'friends' | 'me' | 'group',
    create_date: Date
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
    create_date: { type: Schema.Types.Date, default: Date.now }
})

export default mongoose.model<PostInterface>('Post', PostSchema)