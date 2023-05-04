import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { signUp } from "../../functions/auth"

export default function SignForm() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const tokenContext = useContext(TokenContext)

    const handleFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const handleLastName = (e) => {
        setLastName(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmation = (e) => {
        setPasswordConfirmation(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await signUp(firstName, lastName,email, password, passwordConfirmation)
        tokenContext.setToken(response.token)
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre" onChange={handleFirstName} value={firstName}/>
            <input type="text" placeholder="Apellido" onChange={handleLastName} value={lastName}/>
            <input type="text" placeholder="Correo electronico" onChange={handleEmail} value={email} />
            <input type="text" placeholder="Contraseña" onChange={handlePassword} value={password} />
            <input type="text" placeholder="Confirmacion de Contraseña" onChange={handlePasswordConfirmation} value={passwordConfirmation}/>
            <button>Submit</button>
        </form>
    )
}
