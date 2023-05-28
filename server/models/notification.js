const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    type: {type: String, enum: ['comment', 'reply', 'tag', 'comment_mention', 'post_mention', 'request', 'post', 'post_reaction', 'comment_reaction', 'invitation']},
    sender_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
    reaction: {type: Schema.Types.ObjectId, ref: 'Reaction'},
    create_date: {type: Date, default: Date.now},
    request: {type: Schema.Types.ObjectId, ref: 'Relationship'},
    isViewed: {type: Boolean, default: false},
    isVisited: {type: Boolean, default: false}
})

module.exports = mongoose.model('Notification', NotificationSchema)