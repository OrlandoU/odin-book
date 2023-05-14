const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    company: {type: String},
    position: {type: String, required: true},
    location: {type: String},
    is_current: { type: Boolean, default: false }
})

module.exports = mongoose.model('Job', JobSchema)