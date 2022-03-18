import React, {useState} from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from "firebase/auth"
import {authService} from "fbase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            const auth = getAuth();
            if (newAccount) {
                // create account
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // login
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data)
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
            console.log(err)
        }
    }

    const toggleAccount = () => {
        setNewAccount(prev => !prev);
    }

    const onSocialClick = async (event) => {
        const {target: {name}} = event;
        let provider;
        try {
            if (name === "google") {
                provider = new GoogleAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
            } else if (name === "github") {
                provider = new GithubAuthProvider();
                const result = await signInWithPopup(authService, provider);
                const credential = GithubAuthProvider.credentialFromResult(result);
            }

        } catch (err) {

        }

        console.log(event.target.name);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type={"text"} name={"email"} onChange={onChange} placeholder={"Email"} value={email} required/>
                <input type={"password"} name={"password"} onChange={onChange} placeholder={"Password"} value={password} required/>
                <input type={"submit"} value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
            <button name={"google"} onClick={onSocialClick}>Continue with Google</button>
            <button name={"github"} onClick={onSocialClick}>Continue with Github</button>
        </div>
    );
};

export default Auth;