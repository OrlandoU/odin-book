export const login = async (email, password) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': "application/json" }
        })
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            throw new Error('Error on request')
        }
    } catch (error) {
        console.error('Error retrieving jwt', error)
    }

}

export const signUp = async (firstName, lastName, email, password, passwordConfirmation) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, passwordConfirmation }),
            headers: { 'Content-Type': "application/json" }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error retrieving jwt', error)
    }

}
