import { useContext, useState, ChangeEventHandler, FormEventHandler } from "react"
import { Token, TokenContext } from "../../contexts/TokenContext"
import { login } from "../../functions/auth"
import SignForm from "./SignForm";
import Modal from '../Modal'
import { Jwt } from "../../interfaces/Jwt";

export default function LoginForm(): React.JSX.Element {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { setToken } = useContext(TokenContext) as Token

    const handleEmail: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault()
        const response: Jwt | void = await login(email, password)
        if(response){
            setToken(response.token)
        }
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <input type="text" placeholder="Email" value={email} onChange={handleEmail} />
                <input type="text" placeholder="Password" value={password} onChange={handlePassword} />
                <button>Login</button>
                <div className="border-line"></div>
            </form>
            <Modal title={'Register'} trigger={<div className="create-account">Create new account</div>}>
                <SignForm />
            </Modal>
        </div>
    )
}
