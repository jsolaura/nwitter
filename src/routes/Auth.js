import React, {useState} from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
} from "firebase/auth"
import { authService } from "fbase";
import AuthForm from "../components/AuthForm";

const Auth = () => {
    const onSocialClick = async (event) => {
        const {target: {name}} = event;
        let provider;
        let result;
        try {
            if (name === "google") {
                provider = new GoogleAuthProvider();
                result = await signInWithPopup(authService, provider);
                GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
            } else if (name === "github") {
                provider = new GithubAuthProvider();
                result = await signInWithPopup(authService, provider);
                GithubAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
            }
        } catch (err) {
            alert("이메일이 중독되었습니다.")
        }
    }
    return (
        <div>
            <AuthForm />
            <button name={"google"} onClick={onSocialClick}>Continue with Google</button>
            <button name={"github"} onClick={onSocialClick}>Continue with Github</button>
        </div>
    );
};

export default Auth;