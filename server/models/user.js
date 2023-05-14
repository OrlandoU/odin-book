var mongoose = require('mongoose')
var Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: {type: String, required:true, minLength:1},
    last_name: {type: String, required:true, minLength:1},
    email: {type: String, required: true, minLength:1},
    password: {type:String, required: true},
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    jobs: [{type: Schema.Types.ObjectId, ref: 'Job'}],
    academics: [{ type: Schema.Types.ObjectId, ref: 'Academic' }],
    bio: {type: String},
    birth_day: {type: Date},
    birth_place: {type: String},
    current_place: {type: String},
    profile: {type: String},
    cover: {type: String}
})

module.exports = mongoose.model('User', UserSchema)