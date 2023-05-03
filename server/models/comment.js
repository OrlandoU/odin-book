const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    parent_comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content: { type: String },
    media: { type: String },
})

module.exports = mongoose.model('Comment', CommentSchema)