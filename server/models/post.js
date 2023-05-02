const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    content: {type: String},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    media: {type: String},
    create_date: {type: Schema.Types.Date, default: Date.now}
})

module.exports = mongoose.model('Post', PostSchema)