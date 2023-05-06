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
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}