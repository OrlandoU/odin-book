import Chat from "../interfaces/Chat"
import Message from "../interfaces/Message"

export const getChat = async (token: string, chatId: string): Promise<Chat | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/chats/' + chatId, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })

        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Chat | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const getChatWithUser = async (token: string, userId: string): Promise<Chat | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/chats/user/' + userId, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Chat | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const getChats = async (token: string): Promise<Chat[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/chats', {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Chat[] | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const getUnviewedChats = async (token: string): Promise<Chat[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/chats/unviewed', {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Chat[] | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching chats', error)
    }
}

export const createChat = async (token: string, participants: string | string[]): Promise<Chat | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/chats', {
            method: 'POST',
            body: JSON.stringify({ participants }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Chat | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}



export const getChatLastMessage = async (token: string, chatId: string): Promise<Message | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/last-message`, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const getMessages = async (token: string, chatId: string, queryObj: { limit: any, skip: any }): Promise<Message[] | void> => {
    const queryString: string = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages` + queryString, {
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message[] | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const createMessage = async (token: string, chatId: string, content: string, media: File[]): Promise<Message | void> => {
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
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating message', error)
    }
}

export const updateMessage = async (token: string, messageId: string, chatId: string, isUnsent?: boolean | null, removeForMe?: boolean | null, isRead?: boolean | null, isViewed?: boolean | null): Promise<Message | void> => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages/${messageId}`, {
            method: 'PUT',
            body: JSON.stringify({ isUnsent, removeForMe, isRead, isViewed }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const deleteMessage = async (token: string, chatId: string, messageId: string): Promise<Message | void> => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}

export const removeMessagesForCurrentUser = async (token: string, chatId: string): Promise<Message[] | void> => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/chats/${chatId}/remove`, {
            method: 'PUT',
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Message[] | undefined = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error creating chat', error)
    }
}