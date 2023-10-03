import { ErrorResponse } from "../interfaces/Error"
import Post from "../interfaces/Post"
import Reaction from "../interfaces/Reaction"
import User from "../interfaces/User"

export const getFeedPosts = async (token: JsonWebKey, limit: string = '', skip: string = ''): Promise<Post[] | void> => {
    const queryString = '?' + new URLSearchParams({ limit, skip }).toString()
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/feed' + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        
        if (response.ok) {
            const data: Post[] = await response.json()
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

export const queryPosts = async (token: JsonWebKey, string: string, isMedia: boolean, isFriends: boolean, limit: string = '', skip: string = ''): Promise<Post[] | void> => {
    try {
        let isFriendsString = isFriends ? 'true' : ''
        let isMediaString = isFriends ? 'true' : ''
        const queryString: string = '?' + new URLSearchParams({ skip, limit, query: string, isMedia: isMediaString, isFriends: isFriendsString }).toString()
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/query' + queryString, {
            headers: { 'authorization': 'bearer ' + token }
        })
        if (!response.ok) {
            throw new Error('Invalid')
        } else {
            const data: Post[] = await response.json()
            return data
        }
    } catch (error) {
        console.error('Error retrieving user data', error)
    }
}

export const getGroupsFeedPosts = async (token: JsonWebKey, limit: string = '', skip: string = ''): Promise<Post[] | void> => {
    try {
        const queryString: string = '?' + new URLSearchParams({ limit, skip }).toString()
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/group_feed' + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Post[] = await response.json()
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

export const getPosts = async (token: JsonWebKey, queryObj: any): Promise<Post[] | void> => {
    try {
        const queryString: string = '?' + new URLSearchParams(queryObj).toString()
        const response: Response = await fetch('https://oodinbook.fly.dev/posts' + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Post[] = await response.json()
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

export const getPostsWithPhotos = async (token: JsonWebKey, userId: string, queryObj?: any): Promise<Post[] | void> => {
    const queryString: string = '?' + new URLSearchParams(queryObj).toString()
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/photos/' + userId + queryString, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Post[] = await response.json()
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

export const getPostFormatted = (time: string): string => {
    let Ntime: Date = new Date(time)
    let hours: number = Math.abs(new Date().getTime() - Ntime.getTime()) / 36e5;
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
export const getPostFormattedAlt = (time: string): string => {
    let Ntime: Date = new Date(time)
    let hours: number = Math.abs(new Date().getTime() - Ntime.getTime()) / 36e5;
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

export const createPost = async (token: JsonWebKey, content: string, mentions: string, multiple_media: File[], groupId: string, privacy: string): Promise<Post | void> => {
    try {
        const formData: FormData = new FormData()
        formData.append('content', content)
        if (mentions && Array.isArray(mentions) && mentions.length > 0) {
            formData.append('mentions', mentions)
        }
        for (let i = 0; i < multiple_media.length; i++) {
            formData.append('multiple_media', multiple_media[i])
        }
        formData.append('group_id', groupId)
        formData.append('scope', privacy)


        let response: Response
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

        if (response.ok) {
            const data: Post = await response.json()
            return data
        } else {
            const errors:ErrorResponse = await response.json()
            if (Array.isArray(errors)) {
                throw new Error(errors[0].msg)
            } else {
                throw new Error(errors)
            }
        }
    } catch (error) {
        console.log(error)
        console.error('Error creating post', error)
    }
}

export const updatePost = async (token: JsonWebKey, postId: string, updateObject: Post): Promise<Post | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/' + postId, {
            method: 'PUT',
            body: JSON.stringify(updateObject),
            headers: {
                'authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const data: Post = await response.json()
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
        console.error('Error creating post', error)
    }
}

export const deletePost = async (token: JsonWebKey, postId: string) : Promise<Post | void> => {
    try {
        const response: Response = await fetch('https://oodinbook.fly.dev/posts/' + postId, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Post = await response.json()
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
        console.error('Error creating post', error)
    }
}

export const getCommentsUnderPost = async (token: JsonWebKey, postId: string, parentCommentId: string = ''): Promise<Comment[] | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId}`, {
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Comment[] = await response.json()
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
        console.error('Error creating post', error)
    }
}

export const getCommentsCount = async (token: JsonWebKey, postId: string, parentCommentId: string): Promise<Comment[] | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId ? parentCommentId + '/' : ''}count`, {
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Comment[] = await response.json()
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
        console.error('Error getting comments count', error)
    }
}

export const createComment = async (token: JsonWebKey, postId: string, parentCommentId: string, content: string, media: File, mentions: string[]): Promise<Comment | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${parentCommentId}`, {
            method: 'POST',
            body: JSON.stringify({ content, media, mentions }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Comment = await response.json()
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
        console.error('Error creating comment', error)
    }
}

export const deleteComment = async (token: JsonWebKey, postId: string, commentId: string): Promise<Comment | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Comment = await response.json()
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
        console.error('Error deleting comment', error)
    }
}

export const createReaction = async (token: JsonWebKey, parentId: string, type: string, parentCollection: string, parentAuthor: string): Promise<Reaction | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
            method: 'POST',
            body: JSON.stringify({ type, parentCollection, parentAuthor }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Reaction = await response.json()
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
        console.error('Error creating reaction', error)
    }
}

export const getReactions = async (token: JsonWebKey, parentId: string): Promise<Reaction[] | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Reaction[] = await response.json()
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
        console.error('Error getting reaction', error)
    }
}

export const getReactionsCount = async (token: JsonWebKey, parentId: string): Promise<number | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction/count`, {
            method: 'GET',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: number = await response.json()
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
        console.error('Error getting reactions count', error)
    }
}

export const deleteReaction = async (token: JsonWebKey, parentId: string): Promise<Reaction | void> => {
    try {
        const response: Response = await fetch(`https://oodinbook.fly.dev/posts/${parentId}/reaction`, {
            method: 'DELETE',
            headers: {
                'authorization': 'bearer ' + token
            }
        })
        if (response.ok) {
            const data: Reaction = await response.json()
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
        console.error('Error deleting comment', error)
    }
}