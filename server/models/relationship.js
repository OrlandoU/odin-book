const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RelationshipSchema = new Schema({
    user1_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender_id: {type: Schema.Types.ObjectId, ref:'User', required: true},
    blocker: { type: Schema.Types.ObjectId, ref: 'User'},
    create_date: {type: Date, default:Date.now},
    value: {type: Number, default: 0},
    request_state: {type: String, default:'Pending', enum: ['Pending', 'Accepted', 'Rejected']}
})

module.exports = mongoose.model('Relationship', RelationshipSchema)