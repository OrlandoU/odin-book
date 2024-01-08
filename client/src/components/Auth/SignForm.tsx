import { useContext, useState, ChangeEventHandler, FormEventHandler, JSX } from "react"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { signUp } from "../../functions/auth"
import { Jwt } from "../../interfaces/Jwt"

export default function SignForm(): JSX.Element  {
    const [errors, setErrors] = useState<{msg: string}[]>([])
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')

    const { setToken } = useContext(TokenContext) as Token

    const handleFirstName: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFirstName(e.target.value)
    }

    const handleLastName: ChangeEventHandler<HTMLInputElement> = (e) => {
        setLastName(e.target.value)
    }

    const handleEmail: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordConfirmation: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPasswordConfirmation(e.target.value)
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.stopPropagation()
        e.preventDefault()

        const response: Jwt | void = await signUp(firstName, lastName, email, password, passwordConfirmation)
        if (Array.isArray(response)) {
            setErrors(response)
        } else {
            if(response){
                setToken(response.token)
            }
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
