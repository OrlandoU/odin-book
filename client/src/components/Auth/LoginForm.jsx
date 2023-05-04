import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { login } from "../../functions/auth"

export default function LoginForm(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const tokenContext = useContext(TokenContext)

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await login(email, password)
        tokenContext.setToken(response.token)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Correo electronico" value={email} onChange={handleEmail}/>
            <input type="text" placeholder="Contraseña" value={password} onChange={handlePassword}/>
            <button>Submit</button>
        </form>
    )
}
