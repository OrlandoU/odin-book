import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { createPost } from "../../functions/posts"

export default function PostForm() {
    const [content, setContent] = useState('')
    const tokenContext = useContext(TokenContext)

    const handleContent = (e) => {
        setContent(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await createPost(tokenContext.token, content)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Content" onChange={handleContent} />
            <button>Submit</button>
        </form>
    )
}
