export const getNotifications = async (token, queryObj) => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response = await fetch('http://localhost:3000/notifications' + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            if (Array.isArray(data)) {
                throw new Error(data[0].msg)
            } else {
                throw new Error(data)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const updateToViewedNotifications = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/notifications/viewed', {
            method: 'PUT',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            if (Array.isArray(data)) {
                throw new Error(data[0].msg)
            } else {
                throw new Error(data)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const updateNotification = async (token, id, isVisited, ) => {
    try {
        const response = await fetch('http://localhost:3000/notifications/' + id, {
            method: 'PUT',
            body: JSON.stringify({isVisited}),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            if (Array.isArray(data)) {
                throw new Error(data[0].msg)
            } else {
                throw new Error(data)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}