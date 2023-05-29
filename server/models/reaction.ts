import mongoose, { Document, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface ReactionInterface extends Document {
    parent_id: Types.ObjectId,
    user_id: Types.ObjectId,
    type: 'like' | 'angry' | 'care' | 'haha' | 'love' | 'sad' | 'wow',
    parent_collection: 'post' | 'comment'
}

const ReactionSchema = new Schema({
    parent_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['like', 'angry', 'care', 'haha', 'love', 'sad', 'wow'],
        default: 'like'
    },
    parent_collection: { type: String, enum: ['post', 'comment'], default: 'Post' }
})

export default mongoose.model<ReactionInterface>('Reaction', ReactionSchema)