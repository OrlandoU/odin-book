export const getCurrentUser = async (token) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/user', {
            headers: { 'authorization': 'bearer ' + token}            
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}