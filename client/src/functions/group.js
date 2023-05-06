export const createGroup = async (token, name, profile, cover) => {
    try {
        const response = await fetch('http://localhost:3000/groups', {
            method: 'POST',
            body: JSON.stringify({ name, profile, cover }),
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
        console.error('Error fetching friends', error)
    }
}

export const updateGroup = async (token, groupId, name, profile, cover) => {
    try {
        const response = await fetch('http://localhost:3000/groups/'+ groupId, {
            method: 'PUT',
            body: JSON.stringify({ name, profile, cover }),
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
        console.error('Error fetching friends', error)
    }
}

export const deleteGroup = async (token, groupId) => {
    try {
        const response = await fetch('http://localhost:3000/groups/'+ groupId, {
            method: 'DELETE',
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
        console.error('Error fetching friends', error)
    }
}

export const joinGroup = async (token, groupId) => {
    try {
        const response = await fetch(`http://localhost:3000/groups/${groupId}/join`, {
            method: 'POST',
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
        console.error('Error fetching friends', error)
    }
}

export const leaveGroup = async (token, groupId) => {
    try {
        const response = await fetch(`http://localhost:3000/groups/${groupId}/leave`, {
            method: 'DELETE',
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
        console.error('Error fetching friends', error)
    }
}