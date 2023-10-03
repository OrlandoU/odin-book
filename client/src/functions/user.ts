import Academic from "../interfaces/Academic"
import Job from "../interfaces/Job"
import Post from "../interfaces/Post"
import User from "../interfaces/User"

export const getCurrentUser = async (token: JsonWebKey): Promise<User | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user', {
            headers: { 'authorization': 'bearer ' + token }
        })
        const data: User = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getUserInfo = async (token: JsonWebKey, userId: string): Promise<User | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/' + userId, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: User = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const queryUser = async (token: JsonWebKey, string: string): Promise<User[] | void> => {
    try {
        const queryString = '?' + new URLSearchParams({ query: string }).toString()
        const response: Response = await fetch('https://oodinbook.fly.dev/user/search' + queryString, {
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

export const updateProfile = async (token: JsonWebKey, profile: File, content: string): Promise<Post | void> => {
    try {
        const formData = new FormData()
        formData.append('profile', profile)
        formData.append('content', content)

        const response: Response = await fetch('https://oodinbook.fly.dev/user/profile', {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data: Post = await response.json()
        return data
    } catch (error) {
        console.error('Error updating profile', error)
    }
}

export const updateCover = async (token: JsonWebKey, cover: File, content: string): Promise<Post | void> => {
    try {
        const formData = new FormData()
        formData.append('cover', cover)
        formData.append('content', content)

        const response: Response = await fetch('https://oodinbook.fly.dev/user/cover', {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data: Post = await response.json()
        return data
    } catch (error) {
        console.error('Error updating profile', error)
    }
}

export const updateUser = async (token: JsonWebKey, birth_place: string, current_place: string, bio: string): Promise<User | void> => {
    try {

        const response: Response = await fetch('https://oodinbook.fly.dev/user/', {
            method: 'PUT',
            body: JSON.stringify({
                birth_place, current_place, bio
            }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data: User = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const createUserJob = async (token: JsonWebKey, company: string, position: string, location: string, isCurrent: boolean): Promise<Job | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/job', {
            method: 'POST',
            body: JSON.stringify({ company, position, location, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data: Job = await response.json()
        return data
    } catch (error) {
        console.error('Error creating user job record', error)
    }
}

export const updateUserJob = async (token: JsonWebKey, jobId: string, company: string, position: string, location: string, isCurrent: boolean): Promise<Job | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/job/' + jobId, {
            method: 'PUT',
            body: JSON.stringify({ company, position, location, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data: Job = await response.json()
        return data
    } catch (error) {
        console.error('Error updating user job record', error)
    }
}


export const deleteUserJob = async (token: JsonWebKey, jobId: string): Promise<Job | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/job/' + jobId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data: Job = await response.json()
        return data
    } catch (error) {
        console.error('Error deleting user job record', error)
    }
}

export const createUserAcademic = async (token: JsonWebKey, school: string, isCurrent: boolean): Promise<Academic | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/academic', {
            method: 'POST',
            body: JSON.stringify({ school, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data: Academic = await response.json()
        return data
    } catch (error) {
        console.error('Error creating user academic record', error)
    }
}

export const updateUserAcademic = async (token: JsonWebKey, academicId: string, school: string, isCurrent: boolean): Promise<Academic | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/academic/' + academicId, {
            method: 'PUT',
            body: JSON.stringify({ school, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data: Academic = await response.json()
        return data
    } catch (error) {
        console.error('Error updating academic record', error)
    }
}

export const deleteUserAcademic = async (token: JsonWebKey, academicId: string): Promise<Academic | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/user/academic/' + academicId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data: Academic = await response.json()
        return data
    } catch (error) {
        console.error('Error deleting academic record', error)
    }
}