const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required:true},
    create_date: {type: Schema.Types.Date, default: Date.now},
    privacy: {type: String, enum: ['public', 'private'], default: 'public'},
    last_active: {type: Date, default: Date.now},
    cover: {type: String},
    banned: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Group', GroupSchema)