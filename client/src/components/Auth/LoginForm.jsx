import { useContext, useState } from "react"
import { TokenContext } from "../../contexts/TokenContext"
import { login } from "../../functions/auth"
import SignForm from "./SignForm";
import Modal from '../Modal'

export default function LoginForm() {
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
