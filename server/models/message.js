const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isFirst: { type: Boolean, default: false },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    isViewed: { type: Boolean, default: false },
    create_date: { type: Date, default: Date.now },
    media: { type: String },
    removed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isUnsent: { type: Boolean, default: false }
})

module.exports = mongoose.model('Message', MessageSchema)