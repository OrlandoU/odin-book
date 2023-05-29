import mongoose, { Date, Document, ObjectId, Types } from 'mongoose'
const Schema = mongoose.Schema

export interface GroupInterface extends Document {
    creator: Types.ObjectId,
    name: string,
    create_date: Date,
    privacy: 'public'| 'private',
    last_active: string,
    cover: string,
    banned: Types.ObjectId[]
}

const GroupSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required:true},
    create_date: {type: Schema.Types.Date, default: Date.now},
    privacy: {type: String, enum: ['public', 'private'], default: 'public'},
    last_active: {type: Date, default: Date.now},
    cover: {type: String},
    banned: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

export default mongoose.model<GroupInterface>('Group', GroupSchema)