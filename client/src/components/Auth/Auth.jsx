import LoginForm from "./LoginForm";
import SignForm from "./SignForm";

export default function Auth(){
    return (
        <main>
            <div className="auth-main-wrapper">
                <div className="auth-moto">
                    <h1>odinbook</h1>
                    <p>FacebookFacebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.</p>
                </div>
                <LoginForm />
                <SignForm />
            </div>
        </main>
    )
}