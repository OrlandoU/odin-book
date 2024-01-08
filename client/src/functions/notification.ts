import { ErrorResponse } from "../interfaces/Error"
import Notification, { NotificationAlt } from "../interfaces/Notification"

export const getNotifications = async (token: string, queryObj: any): Promise<Notification[] | void> => {
    const queryString: string = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications' + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Notification[] = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const upsertNotification = async (token: string, user_id: string, notificationDocument: NotificationAlt): Promise<Notification | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications/', {
            method: 'POST',
            body: JSON.stringify({ user_id, ...notificationDocument }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const data: Notification = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const updateToViewedNotifications = async (token: string): Promise<Notification | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications/viewed', {
            method: 'PUT',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Notification = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const updateNotification = async (token: string, id: string, isVisited: boolean): Promise<Notification | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications/' + id, {
            method: 'PUT',
            body: JSON.stringify({ isVisited }),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const data: Notification = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const deleteNotification = async (token: string, id: string): Promise<Notification | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications/' + id, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token,
            }
        })
        if (response.ok) {
            const data: Notification = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}

export const deleteMultipleNotification = async (token: string, queryObj: any): Promise<Notification[] | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/notifications/many', {
            method: 'DELETE',
            body: JSON.stringify(queryObj),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const data: Notification[] | any = await response.json()
            return data
        } else {
            const errors: ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.error('Error retrieving posts', error)
    }
}