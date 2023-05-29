import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { UserInterface } from '../models/user';
import { Server, Socket } from 'socket.io';
import { MessageInterface } from '../models/message';
import { NotificationInterface } from '../models/notification';
import { Types } from 'mongoose';

type SocketsMap = {
    [user: string]: Socket[]
}

const userSockets: SocketsMap = {}

// Handle Socket.IO connections
export function handleSocketConnections(io: Server): void {
    io.on('connection', (socket: Socket) => {
        //Get User from token
        const user: JwtPayload | string = jwt.verify(socket.handshake.auth.token, 'OdinBook')

        if (typeof user === 'string') return
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

export async function emitUserStatus(userId: string | Types.ObjectId, status: boolean, socket: Socket): Promise<void> {
    const user: UserInterface | null = await User.findByIdAndUpdate(userId, { isOnline: status, lastActive: !status ? new Date() : new Date() }, { new: true }).populate('groups').populate('jobs').populate('academics')
    socket.broadcast.emit("user_status", user);
}

export function emitMessage(userId: string | Types.ObjectId , message: MessageInterface | null): void {
    const userIdString: string = typeof userId === 'string' ? userId : userId._id.toString();
    const sockets: Socket[] = userSockets[userIdString]
    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('new_message', message)
        })
    }
}

export function emitMessageUpdate(userId: string | Types.ObjectId, message: MessageInterface): void {
    const userIdString: string = typeof userId === 'string' ? userId : userId._id.toString();
    const sockets: Socket[] = userSockets[userIdString]

    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('message_update', message)
        })
    }
}

export function emitNotification(userId: string | Types.ObjectId, notification: NotificationInterface): void {
    const userIdString: string = typeof userId === 'string' ? userId : userId._id.toString();
    const sockets: Socket[] = userSockets[userIdString]

    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('new_notification', notification)
        })
    }
}

export function emitRemoveNotification(userId: string | Types.ObjectId, notification: NotificationInterface): void {
    const userIdString: string = typeof userId === 'string' ? userId : userId._id.toString();
    const sockets: Socket[] = userSockets[userIdString]

    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('remove_notification', notification)
        })
    }
}

export function emitRemoveChat(userId: string | Types.ObjectId, notification: NotificationInterface): void {
    const userIdString: string = typeof userId === 'string' ? userId : userId._id.toString();
    const sockets: Socket[] = userSockets[userIdString]

    if (sockets) {
        sockets.forEach(socket => {
            socket.emit('remove_chat', notification)
        })
    }
}
