import mongoose, { Document, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface ChatInterface extends Document {
    participants: Types.ObjectId[],
    isGroup: boolean,
    lastActive: Date,
}

const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGroup: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now }
})

export default mongoose.model<ChatInterface>('Chat', ChatSchema)