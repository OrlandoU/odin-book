const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required:true},
    create_date: {type: Schema.Types.Date, default: Date.now},
    profile: {type: String},
    cover: {type: String},
    banned: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Group', GroupSchema)