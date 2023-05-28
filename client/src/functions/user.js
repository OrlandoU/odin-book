export const getCurrentUser = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/user', {
            headers: { 'authorization': 'bearer ' + token }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getUserInfo = async (token, userId) => {
    try {
        const response = await fetch('http://localhost:3000/user/' + userId, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if(!response.ok){
            throw new Error('Invalid')
        } else {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const queryUser = async (token, string) => {
    try {
        const queryString = '?' + new URLSearchParams({query: string}).toString()
        const response = await fetch('http://localhost:3000/user/search' + queryString, {
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

export const updateProfile = async (token, profile, content) => {
    try {
        const formData = new FormData()
        formData.append('profile', profile)
        formData.append('content', content)

        const response = await fetch('http://localhost:3000/user/profile', {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error updating profile', error)
    }
}

export const updateCover = async (token, cover, content) => {
    try {
        const formData = new FormData()
        formData.append('cover', cover)
        formData.append('content', content)

        const response = await fetch('http://localhost:3000/user/cover', {
            method: 'PUT',
            body: formData,
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error updating profile', error)
    }
}

export const updateUser = async (token, birth_place, current_place, bio) => {
    try {
        
        const response = await fetch('http://localhost:3000/user/', {
            method: 'PUT',
            body: JSON.stringify({
                birth_place, current_place, bio
            }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const createUserJob = async (token, company, position, location, isCurrent) => {
    try {
        const response = await fetch('http://localhost:3000/user/job', {
            method: 'POST',
            body: JSON.stringify({ company, position, location, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating user job record', error)
    }
}

export const updateUserJob = async (token, jobId, company, position, location, isCurrent) => {
    try {
        const response = await fetch('http://localhost:3000/user/job/' + jobId, {
            method: 'PUT',
            body: JSON.stringify({ company, position, location, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error updating user job record', error)
    }
}


export const deleteUserJob = async (token, jobId) => {
    try {
        const response = await fetch('http://localhost:3000/user/job/' + jobId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error deleting user job record', error)
    }
}

export const createUserAcademic = async (token, school, isCurrent) => {
    try {
        const response = await fetch('http://localhost:3000/user/academic', {
            method: 'POST',
            body: JSON.stringify({ school, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating user academic record', error)
    }
}

export const updateUserAcademic = async (token, academicId, school, isCurrent) => {
    try {
        const response = await fetch('http://localhost:3000/user/academic/' + academicId, {
            method: 'PUT',
            body: JSON.stringify({ school, isCurrent }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error updating academic record', error)
    }
}

export const deleteUserAcademic = async (token, academicId) => {
    try {
        const response = await fetch('http://localhost:3000/user/academic/' + academicId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error deleting academic record', error)
    }
}