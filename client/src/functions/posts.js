export const getFeedPosts = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/posts', {
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

export const getPosts = async (token, queryObj) => {
    try {
        const queryString = '?' + new URLSearchParams(queryObj).toString()
        const response = await fetch('http://localhost:3000/posts' + queryString, {
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

export const getPostFormatted = (time) => {
    time = new Date(time)
    let hours = Math.abs(new Date().getTime() - time) / 36e5;
    if (hours < 1) {
        if (hours * 60 < 2) {
            return Math.trunc((hours * 60) * 60) + 's'
        }
        return Math.trunc(hours * 60) + 'min'
    } else if (hours > 24) {
        let date = (new Date(time).toDateString()).split(' ')
        return date[1] + ' ' + date[2
        ]
    }
    return Math.trunc(hours) + 'h'

}

export const createPost = async (token, content, media) => {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: JSON.stringify({ content, media }),
            headers: {
                'Content-Type': "application/json",
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
        console.error('Error creating post', error)
    }
}

export const deletePost = async (token, postId) => {
    try {
        const response = await fetch('http://localhost:3000/posts/' + postId, {
            method: 'DELETE',
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
        console.error('Error creating post', error)
    }
}

export const getCommentsUnderPost = async (token, postId, parentCommentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${parentCommentId}`, {
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
        console.error('Error creating post', error)
    }
}

export const getCommentsCount = async (token, postId, parentCommentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${parentCommentId ? parentCommentId + '/' : ''}count`, {
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
        console.error('Error getting comments count', error)
    }
}

export const createComment = async (token, content, media, postId, parentCommentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${parentCommentId}`, {
            method: 'POST',
            body: JSON.stringify({ content, media }),
            headers: {
                'Content-Type': 'application/json',
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
        console.error('Error creating comment', error)
    }
}

export const deleteComment = async (token, postId, commentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
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
        console.error('Error deleting comment', error)
    }
}

export const createReaction = async (token, parentId, type) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${parentId}/reaction`, {
            method: 'POST',
            body: JSON.stringify({ type }),
            headers: {
                'Content-Type': 'application/json',
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
        console.error('Error creating reaction', error)
    }
}

export const getReactions = async (token, parentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${parentId}/reaction`, {
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
        console.error('Error getting reaction', error)
    }
}

export const getReactionsCount = async (token, parentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${parentId}/reaction/count`, {
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
        console.error('Error getting reactions count', error)
    }
}

export const deleteReaction = async (token, parentId) => {
    try {
        const response = await fetch(`http://localhost:3000/posts/${parentId}/reaction`, {
            method: 'DELETE',
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
        console.error('Error deleting comment', error)
    }
}