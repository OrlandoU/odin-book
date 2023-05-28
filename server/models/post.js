const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    content: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String },
    multiple_media: [{ type: String }],
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isInTrash: { type: Boolean, default: false },
    type: {
        type: String,
        enum: ['normal', 'profile', 'cover', 'group-create', 'group-cover', 'birth'],
        default: 'normal'
    },
    scope: {
        type: String,
        enum: ['public', 'friends', 'me', 'group'],
        default: 'public'
    },
    create_date: { type: Schema.Types.Date, default: Date.now }
})

module.exports = mongoose.model('Post', PostSchema)