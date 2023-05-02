const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String},
    media: {type: String}
})

module.exports = mongoose.model('Message', MessageSchema)