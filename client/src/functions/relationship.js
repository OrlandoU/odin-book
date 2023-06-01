export const getFriends = async (token, userId, queryObj) => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response = await fetch('https://oodinbook.fly.dev/rel/' + userId + queryString, {
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

export const getRelationship = async (token, userId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/rel/' + userId + '/relationship', {
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

export const getFriendSuggestions = async (token) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/rel/suggestions', {
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data)
        } else {
            return data
        }
    } catch (error) {
        console.error('Error fetching friends suggestions', error)
    }
}

export const getFriendInCommon = async (token, userId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/rel/in-common/' + userId, {
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
        const response = await fetch('https://oodinbook.fly.dev/rel/requests', {
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
        const response = await fetch('https://oodinbook.fly.dev/rel/' + userId, {
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
        const response = await fetch('https://oodinbook.fly.dev/rel/' + userId, {
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
        const response = await fetch(`https://oodinbook.fly.dev/rel/${userId}/accept`, {
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