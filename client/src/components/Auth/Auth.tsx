import LoginForm from "./LoginForm";
import '../../assets/styles/Auth.css'
import React from "react";

export default function Auth(): JSX.Element{
    return (
        <main className="main-auth">
            <div className="auth-main-wrapper">
                <div className="auth-moto">
                    <h1>odinbook</h1>
                    <p>Facebook helps you connect and share with the people in your life.</p>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}