const User = require('../models/user')
exports.current_get =async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('groups')
        return res.json(user)
    } catch (error) {
        next(error)
    }
}

exports.user_get = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId, {password: -1})
        return res.json(user)
    } catch (error) {
        next(error)
    }
}