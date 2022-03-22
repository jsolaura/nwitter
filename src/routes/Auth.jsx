import React from 'react';
import styles from "components/Auth.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faGoogle,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
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
            } else if (name === "github") {
                provider = new GithubAuthProvider();
                result = await signInWithPopup(authService, provider);
                GithubAuthProvider.credentialFromResult(result);
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={"app"}>
            <div className={"authSection"}>
                <FontAwesomeIcon icon={faTwitter} color={"#04aaff"} size={"3x"} />
                <AuthForm />
                <div className={styles.authBtns}>
                    <button name={"google"} onClick={onSocialClick} className={styles.authBtn}>
                        Continue with Google <FontAwesomeIcon icon={faGoogle} />
                    </button>
                    <button name={"github"} onClick={onSocialClick} className={styles.authBtn}>
                        Continue with Github <FontAwesomeIcon icon={faGithub} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;