const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    isGroup: {type:Boolean, default: false}
})

module.exports = mongoose.model('Chat',ChatSchema)