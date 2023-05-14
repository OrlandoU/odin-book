export const getChat = async (token, chatId) => {
    try {
        const response = await fetch('http://localhost:3000/chats/'+ chatId, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const getChatWithUser = async (token, userId) => {
    try {
        const response = await fetch('http://localhost:3000/chats/user/' + userId, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const getChats = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/chats', {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const createChat = async (token, participants) => {
    try {
        const response = await fetch('http://localhost:3000/chats', {
            method: 'POST',
            body: JSON.stringify({ participants }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}
export const getChatLastMessage = async (token, chatId) => {
    try {
        const response = await fetch(`http://localhost:3000/chats/${chatId}/last-message`, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const getMessages = async (token, chatId) => {
    try {
        const response = await fetch(`http://localhost:3000/chats/${chatId}/messages`, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const createMessage = async (token, chatId, content, media) => {
    try {
        const response = await fetch(`http://localhost:3000/chats/${chatId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content, media }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error creating message', error)
    }
}

export const deleteMessage = async (token,chatId, messageId) => {
    try {
        const response = await fetch(`http://localhost:3000/chats/${chatId}/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}