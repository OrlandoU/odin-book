import mongoose, { Types } from 'mongoose'
import { Document } from 'mongoose'
const Schema = mongoose.Schema

export interface RelationshipInterface extends Document {
    user1_id: Types.ObjectId,
    user2_id: Types.ObjectId,
    sender_id: Types.ObjectId,
    blocker: Types.ObjectId,
    create_date: Date,
    value: number,
    request_state: string
}

const RelationshipSchema = new Schema({
    user1_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blocker: { type: Schema.Types.ObjectId, ref: 'User' },
    create_date: { type: Date, default: Date.now },
    value: { type: Number, default: 0 },
    request_state: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] }
})

export default mongoose.model<RelationshipInterface>('Relationship', RelationshipSchema)