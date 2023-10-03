import Relationship, { RelationshipExtended } from "../interfaces/Relationship"
import User from "../interfaces/User"

export const getFriends = async (token: JsonWebKey, userId: string, queryObj?: any): Promise<RelationshipExtended[] | void> => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/' + userId + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json() 
            throw new Error(error)
        } else {
            const data: RelationshipExtended[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const getRelationship = async (token: JsonWebKey, userId: string): Promise<Relationship | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/' + userId + '/relationship', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const getFriendSuggestions = async (token: JsonWebKey): Promise<User[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/suggestions', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: User[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends suggestions', error)
    }
}

export const getFriendInCommon = async (token: JsonWebKey, userId: string): Promise<Relationship[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/in-common/' + userId, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const getFriendRequests = async (token: JsonWebKey): Promise<Relationship[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/requests', {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const removeFriend = async (token: JsonWebKey, userId: string): Promise<Relationship | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/' + userId, {
            method: 'DELETE',
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const sendFriendRequest = async (token: JsonWebKey, userId: string): Promise<Relationship | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/rel/' + userId, {
            method: 'POST',
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}

export const acceptFriendRequest = async (token: JsonWebKey, userId: string): Promise<Relationship | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/rel/${userId}/accept`, {
            method: 'PUT',
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            const error: string = await response.json()
            throw new Error(error)
        } else {
            const data: Relationship = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}