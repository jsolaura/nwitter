import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {getAuth, onAuthStateChanged, updateProfile} from "firebase/auth";
import {authService} from "../fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    // user name update 시 주의할 점
    // 1. 모든 setUserObj 을 ↓ 바꿔줘야함
    // setUserObj({
    //     displayName: user.displayName,
    //     uid: user.uid,
    //     updateProfile: (args) => updateProfile(user, {displayName : user.displayName}),
    // });
    // 2. refreshUser 함수를 child 에게 넘김
    // 3. 넘긴 child 가 update 가 필요한 component 에 넘김
    // 4. 인자값으로 넘겨받아 updateProfile(authService.currentUser, { displayName: newDisplayName });

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
