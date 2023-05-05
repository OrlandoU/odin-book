export const getFriends = async (token) => {
    try {
        const response = await fetch('http://localhost:3000/rel', {
            headers: {'authorization': 'bearer ' + token}
        })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data)
        } else{
            return data
        }
    } catch (error) {
        console.error('Error fetching friends', error)
    }
}