const jwt = require('jsonwebtoken');
const User = require('../models/user')
const Relationship = require('../models/relationship')
const userSockets = {}

// Handle Socket.IO connections
function handleSocketConnections(io) {
    io.on('connection', (socket) => {
        //Get User from token
        const user = jwt.verify(socket.handshake.auth.token, 'OdinBook')

        //Associate socket with userId
        if (!userSockets[user._id]) {
            userSockets[user._id] = [];
            emitUserStatus(user._id, true, socket)
        }
        userSockets[user._id].push(socket)

        socket.on('disconnect', async () => {
            console.log(`User ${user._id} disconnected`)

            //Remove associated socket on disconnect
            const sockets = userSockets[user._id]
            const index = sockets.indexOf(socket);
            sockets.splice(index, 1)
            if (!sockets.length) {
                console.log(sockets.length)
                emitUserStatus(user._id, false, socket)
                delete userSockets[user._id]
            }
        })
    });
}

async function emitUserStatus(userId, status, socket) {
    const user = await User.findByIdAndUpdate(userId, { isOnline: status, lastActive: !status ? new Date() : new Date() }, { new: true }).populate('groups').populate('jobs').populate('academics')
    socket.broadcast.emit("user_status", user);
}

function emitMessage(userId, message) {
    const sockets = userSockets[userId]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('new_message', message)
        })
    }
}

function emitMessageUpdate(userId, message) {
    const sockets = userSockets[userId]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('message_update', message)
        })
    }
}

function emitNotification(userId, notification) {
    const sockets = userSockets[userId]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('new_notification', notification)
        })
    }
}

function emitRemoveNotification(userId, notification) {
    const sockets = userSockets[userId]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('remove_notification', notification)
        })
    }
}

function emitRemoveChat(userId, notification) {
    const sockets = userSockets[userId]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('remove_notification', notification)
        })
    }
}


module.exports = {
    emitRemoveNotification,
    handleSocketConnections,
    emitNotification,
    emitMessage,
    emitMessageUpdate
};