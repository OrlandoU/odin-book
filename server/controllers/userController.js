const User = require('../models/user')
exports.current_get =async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        return res.json(user)
    } catch (error) {
        next(error)
    }
}

exports.user_get = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        return res.json(user)
    } catch (error) {
        next(error)
    }
}