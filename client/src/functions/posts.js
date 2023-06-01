export const getFeedPosts = async (token, limit = 0, skip = 0) => {
    const queryString = '?' + new URLSearchParams({ limit, skip }).toString()
    try {
        const response = await fetch('https://oodinbook.fly.dev/posts/feed' + queryString, {
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

export const queryPosts = async (token, string, isMedia, isFriends, limit = 0, skip = 0) => {
    try {
        const queryString = '?' + new URLSearchParams({ skip, limit, query: string, isMedia: isMedia ? isMedia : '', isFriends: isFriends ? isFriends : '' }).toString()
        const response = await fetch('https://oodinbook.fly.dev/posts/query' + queryString, {
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

export const getGroupsFeedPosts = async (token, limit = 0, skip = 0) => {
    try {
        const queryString = '?' + new URLSearchParams({ limit, skip }).toString()
        const response = await fetch('https://oodinbook.fly.dev/posts/group_feed' + queryString, {
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
        const response = await fetch('https://oodinbook.fly.dev/posts' + queryString, {
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

export const getPostsWithPhotos = async (token, userId, queryObj) => {
    const queryString = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response = await fetch('https://oodinbook.fly.dev/posts/photos/' + userId + queryString, {
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
        if (hours * 60 < 1) {
            if (((hours * 60) * 60) < 20) {
                return 'Just now'
            }
            return Math.trunc((hours * 60) * 60) + 's'
        }
        return Math.trunc(hours * 60) + ' min'
    } else if (hours > 24) {
        let date = (new Date(time).toDateString()).split(' ')
        return date[1] + ' ' + date[2
        ]
    }
    return Math.trunc(hours) + 'h'
}
export const getPostFormattedAlt = (time) => {
    time = new Date(time)
    let hours = Math.abs(new Date().getTime() - time) / 36e5;
    if (hours < 1) {
        if (hours * 60 < 1) {
            if (((hours * 60) * 60) < 20) {
                return 'Just now'
            }
            return Math.trunc((hours * 60) * 60) + ' seconds ago'
        }
        return Math.trunc(hours * 60) + ' minutes ago'
    } else if (hours > 24) {
        let date = (new Date(time).toDateString()).split(' ')
        return date[1] + ' ' + date[2
        ]
    }
    return Math.trunc(hours) + ' hours ago'
}

export const createPost = async (token, content, mentions, multiple_media, groupId, privacy) => {
    try {
        const formData = new FormData()
        formData.append('content', content)
        if (mentions && Array.isArray(mentions) && mentions.length > 0) {
            formData.append('mentions', mentions)
        }
        for (let i = 0; i < multiple_media.length; i++) {
            formData.append('multiple_media', multiple_media[i])
        }
        formData.append('group_id', groupId)
        formData.append('scope', privacy)


        let response
        if (multiple_media || multiple_media.length) {
            response = await fetch('https://oodinbook.fly.dev/posts', {
                method: 'POST',
                body: formData,
                headers: {
                    'authorization': 'bearer ' + token,
                }
            })
        } else {
            response = await fetch('https://oodinbook.fly.dev/posts', {
                method: 'POST',
                body: JSON.stringify({ content, mentions, multiple_media, group_id: groupId, scope: privacy }),
                headers: {
                    'authorization': 'bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
        }

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
        console.log(error)
        console.error('Error creating post', error)
    }
}
export const updatePost = async (token, postId, updateObject) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/posts/' + postId, {
            method: 'PUT',
            body: JSON.stringify(updateObject),
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
        console.error('Error creating post', error)
    }
}

export const deletePost = async (token, postId) => {
    try {
        const response = await fetch('https://oodinbook.fly.dev/posts/' + postId, {
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

export const getCommentsUnderPost = async (token, postId, parentCommentId = '') => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId}`, {
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
        const response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId ? parentCommentId + '/' : ''}count`, {
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

export const createComment = async (token, postId, parentCommentId, content, media, mentions) => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId}`, {
            method: 'POST',
            body: JSON.stringify({ content, media, mentions }),
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
        const response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${commentId}`, {
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

export const createReaction = async (token, parentId, type, parentCollection, parentAuthor) => {
    try {
        const response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
            method: 'POST',
            body: JSON.stringify({ type, parentCollection, parentAuthor }),
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
        const response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
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
        const response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction/count`, {
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
        const response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
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