import { Document, ObjectId, Types } from "mongoose"
import mongoose from "mongoose"
var Schema = mongoose.Schema

export interface UserInterface extends Document {
    _id: Types.ObjectId,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    groups: Types.ObjectId[],
    jobs: Types.ObjectId[],
    academics: Types.ObjectId[],
    bio: string,
    birth_day: Date,
    birth_place: string,
    current_place: string,
    profile: string,
    cover: string,
    isOnline: boolean,
    lastActive: Date
}


const UserSchema = new Schema({
    first_name: { type: String, required: true, minLength: 1 },
    last_name: { type: String, required: true, minLength: 1 },
    email: { type: String, required: true, minLength: 1 },
    password: { type: String, required: true },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    academics: [{ type: Schema.Types.ObjectId, ref: 'Academic' }],
    bio: { type: String },
    birth_day: { type: Date },
    birth_place: { type: String },
    current_place: { type: String },
    profile: { type: String },
    cover: { type: String },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date }
})

export default mongoose.model<UserInterface>('User', UserSchema)