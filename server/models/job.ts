import mongoose, { Document } from 'mongoose'
const Schema = mongoose.Schema

export interface JobInterface extends Document {
    company: string,
    position: string,
    location: string,
    is_current: boolean
}

const JobSchema = new Schema({
    company: { type: String },
    position: { type: String, required: true },
    location: { type: String },
    is_current: { type: Boolean, default: false }
})

export default mongoose.model<JobInterface>('Job', JobSchema)