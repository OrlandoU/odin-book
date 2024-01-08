import Group from "../interfaces/Group"
import User from "../interfaces/User"

export const getGroups = async (token: string, queryObj?: any): Promise<Group[] | void> => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups' + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: Group[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupLastActive = async (token: string, groupId: string): Promise<Date | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/last-active', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: Date = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}
export const queryGroups = async (token: string, string: string, limit?: string, skip?: string): Promise<Group[] | void> => {
    try {
        let rLimit = limit ? limit : ''
        let rSkip = skip? skip: ''
        const queryString = '?' + new URLSearchParams({ rSkip, rLimit, query: string }).toString()
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/query' + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: Group[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}
export const createGroup = async (token: string, name: string, privacy: string): Promise<Group | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups', {
            method: 'POST',
            body: JSON.stringify({ name, privacy }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const getGroupInfo = async (token: string, groupId: string): Promise<Group | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupMembers = async (token: string, groupId: string): Promise<User[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/members', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: User[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupMembersCount = async (token: string, groupId: string): Promise<number | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId + '/members-count', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: number = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const updateGroup = async (token: string, groupId: string, name: string, cover: File): Promise<Group | void> => {
    try {
        const formData: FormData = new FormData()
        formData.append('profile', name)
        formData.append('cover', cover)
        console.log(cover)

        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'bearer ' + token,
            }
        })

        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const deleteGroup = async (token: string, groupId: string): Promise<Group | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/groups/' + groupId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token,
            }
        })

        if (!response.ok) {
            const err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const joinGroup = async (token: string, groupId: string): Promise<Group | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/groups/${groupId}/join`, {
            method: 'POST',
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            let err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const leaveGroup = async (token: string, groupId: string): Promise<Group | void> => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/groups/${groupId}/leave`, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (!response.ok) {
            const err: string = await response.json()
            throw new Error(err)
        } else {
            const data: Group = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error leaving group', error)
    }
}