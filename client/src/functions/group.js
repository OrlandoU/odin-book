export const getGroups = async (token, queryObj) => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups' + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupLastActive = async (token, groupId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/last-active', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}
export const queryGroups = async (token, string, limit = 0, skip = 0) => {
    try {
        const queryString = '?' + new URLSearchParams({ skip, limit, query: string }).toString()
        const response = await fetch('https://oodinbook.fly.dev/groups/query' + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}
export const createGroup = async (token, name, privacy) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups', {
            method: 'POST',
            body: JSON.stringify({ name, privacy }),
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

export const getGroupInfo = async (token, groupId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupMembers = async (token, groupId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/members', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupMembersCount = async (token, groupId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/members-count', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const updateGroup = async (token, groupId, name, cover) => {
    try {
        const formData = new FormData()
        formData.append('profile', name)
        formData.append('cover', cover)
        console.log(cover)

        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
            method: 'PUT',
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
        console.error('Error fetching friends', error)
    }
}

export const deleteGroup = async (token, groupId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
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
        const response = await fetch(`https://oodinbook.fly.dev/groups/${groupId}/join`, {
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
        const response = await fetch(`https://oodinbook.fly.dev/groups/${groupId}/leave`, {
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
        console.error('Error leaving group', error)
    }
}