const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RelationshipSchema = new Schema({
    user1_id: { type: Schema.Types.ObjectId, ref: 'User', required },
    user2_id: { type: Schema.Types.ObjectId, ref: 'User', required },
    sender_id: {type: Schema.Types.ObjectId, ref:'User', required},
    blocked: {type: Boolean, default:false},
    value: {type: Number, default: 0},
    request_state: {type: String, default:'Pending'}
})

module.exports = mongoose.model('Relationship', RelationshipSchema)