const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReactionSchema = new Schema({
    parent_id: { type: Schema.Types.ObjectId, required: true },
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: { type: String, default:'like' },
})

module.exports = mongoose.model('Reaction', ReactionSchema)