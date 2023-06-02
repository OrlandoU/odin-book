import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { signUp } from "../../functions/auth"

export default function SignForm() {
    const [errors, setErrors] = useState([])
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
        e.stopPropagation()
        e.preventDefault()
        const response = await signUp(firstName, lastName, email, password, passwordConfirmation)
        if (Array.isArray(response)) {
            setErrors(response)
        } else {
            tokenContext.setToken(response.token)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="sign-form">
            <input type="text" placeholder="First name" onChange={handleFirstName} value={firstName} />
            <input type="text" placeholder="Last name" onChange={handleLastName} value={lastName} />
            <input type="text" className="span2" placeholder="Email" onChange={handleEmail} value={email} />
            <input type="text" className="span2" placeholder="Password" onChange={handlePassword} value={password} />
            <input type="text" className="span2" placeholder="Password Confirmation" onChange={handlePasswordConfirmation} value={passwordConfirmation} />
            {errors.length > 0 && <div className="error-container">
                {errors.map(error =>
                    <div className="error-message">{error.msg}</div>
                )}
            </div>}
            <div className="button-wrapper span2">
                <button>Register</button>
            </div>
        </form>
    )
}
