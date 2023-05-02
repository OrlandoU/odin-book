const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    participants: {type: Schema.Types.Array}
})

module.exports = mongoose.model(ChatSchema)