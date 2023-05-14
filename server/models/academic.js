const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AcademicSchema = new Schema({
    school: {type: String},
    is_current: {type: Boolean, default: false}
})

module.exports = mongoose.model('Academic', AcademicSchema)