import React, {useState} from 'react';
import styles from "./Auth.module.css";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [newAccount, setNewAccount] = useState(true);


    const toggleAccount = () => {
        setNewAccount(prev => !prev);
    }

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

    return (
        <>
        <form onSubmit={onSubmit} className={`container ${styles.authWrap}`}>
            <input type={"text"}
                   name={"email"}
                   onChange={onChange}
                   placeholder={"Email"}
                   value={email}
                   className={styles.authInput}
                   required/>
            <input type={"password"}
                   name={"password"}
                   onChange={onChange}
                   placeholder={"Password"}
                   value={password}
                   className={styles.authInput}
                   autoComplete={"current-password"}
                   required/>
            <input type={"submit"}
                   className={`${styles.authInput} ${styles.authSubmit}`}
                   value={newAccount ? "Create Account" : "Log In"} />
            {error && <span className={styles.authError}>{error}</span> }
        </form>
        <span className={styles.authSwitch} onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        </>
    );
};

export default AuthForm;