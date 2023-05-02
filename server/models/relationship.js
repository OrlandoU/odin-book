const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RelationshipSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required },
    friend_id: { type: Schema.Types.ObjectId, ref: 'User', required },
    value: {type: Number, default: 0},
    request_state: {type: String, default:'Pending'}
})

module.exports = mongoose.model('Relationship', RelationshipSchema)