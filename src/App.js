import React, {useEffect, useState} from "react";
import "style.css";
import AppRouter from "components/Router";
import {getAuth, onAuthStateChanged, updateProfile} from "firebase/auth";
import {authService} from "./fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => updateProfile(user, {displayName : user.displayName}),

                });
            } else {
                setIsLoggedIn(false);
                setUserObj(null);
            }
            setInit(true);
        });
    }, [])

    const refreshUser= () => {
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => updateProfile(user, {displayName : user.displayName}),
        });
    };

    return (
        <>
            {init ? <AppRouter isLoggedIn={Boolean(isLoggedIn)} userObj={userObj} refreshUser={refreshUser} /> : "Initializing....."}
            {/*<footer>&copy; {new Date().getFullYear()} Nwitter</footer>*/}
        </>
    );

}

export default App;
