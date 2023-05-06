export const getFriends = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/rel', {
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const getFriendRequests = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/rel/requests', {
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const removeFriend = async (token, userId) => {
    try {
        const response = await fetch('http://localhost:3000/rel/' + userId, {
            method: 'DELETE',
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const sendFriendRequest = async (token, userId) => {
    try {
        const response = await fetch('http://localhost:3000/rel/' + userId, {
            method: 'POST',
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const acceptFriendRequest = async (token, userId) => {
    try {
        const response = await fetch(`http://localhost:3000/rel/${userId}/accept`, {
            method: 'PUT',
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}