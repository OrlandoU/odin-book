import mongoose, { Document } from 'mongoose'
const Schema = mongoose.Schema

export interface AcademicInterface extends Document {
    school: string,
    is_current: boolean
}

const AcademicSchema = new Schema({
    school: { type: String },
    is_current: { type: Boolean, default: false }
})

export default mongoose.model<AcademicInterface>('Academic', AcademicSchema)