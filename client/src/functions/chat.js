export const getChat = async (token, chatId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/chats/' + chatId, {
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
        const response = await fetch('https://oodinbook.fly.dev/chats/user/' + userId, {
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
        const response = await fetch('https://oodinbook.fly.dev/chats', {
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

export const getUnviewedChats = async (token) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/chats/unviewed', {
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
        const response = await fetch('https://oodinbook.fly.dev/chats', {
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
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/last-message`, {
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

export const getMessages = async (token, chatId, queryObj) => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages` + queryString, {
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
    const formData = new FormData()
    for (let i = 0; i < media.length; i++) {
        formData.append('media', media[i])
    }
    formData.append('content', content)
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages`, {
            method: 'POST',
            body: formData,
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
        console.error('Error creating message', error)
    }
}

export const updateMessage = async (token, messageId, chatId, isUnsent, removeForMe, isRead, isViewed) => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages/${messageId}`, {
            method: 'PUT',
            body: JSON.stringify({ isUnsent, removeForMe, isRead, isViewed }),
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

export const deleteMessage = async (token, chatId, messageId) => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages/${messageId}`, {
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

export const removeMessagesForCurrentUser = async (token, chatId) => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/remove`, {
            method: 'PUT',
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