var mongoose = require('mongoose')
var Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: {type: String, required:true, minLength:1},
    last_name: {type: String, required:true, minLength:1},
    email: {type: String, required: true, minLength:1},
    password: {type:String, required: true},
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    profile: {type: String},
    cover: {type: String}
})

module.exports = mongoose.model('User', UserSchema)