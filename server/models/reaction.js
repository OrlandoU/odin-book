const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReactionSchema = new Schema({
    parent_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['like', 'angry', 'care', 'haha', 'love', 'sad', 'wow'],
        default: 'like'
    },
    parent_collection: { type: String, enum: ['post', 'comment'], default: 'Post' }
})

module.exports = mongoose.model('Reaction', ReactionSchema)