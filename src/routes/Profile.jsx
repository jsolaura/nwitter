import React, {useEffect, useState} from 'react';
import "./common.css";
import {authService, dbService} from "fbase";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore"
import { updateProfile } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [ newDisplayName, setNewDisplayName ] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        }
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }


    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc"),
            where(
                "creatorId",
                "==",
                `${userObj.uid}`,
            )
        );
        onSnapshot(q, (snapshot => {
            const myNweet = snapshot.docs.map((document) => (
                console.log(document.id, " => ", document.data())
            ));
        }))
    };

    useEffect(() => {
        getMyNweets();
    }, [])

    return (
        <div className={"container"}>
            <form onSubmit={onSubmit} className={"profileForm"}>
                <input onChange={onChange}
                       type={"text"}
                       placeholder={"Display Name"}
                       value={newDisplayName}
                       className={"formInput"}
                       style={{
                           marginTop: 10,
                       }}
                />
                <input type={"submit"} value={"Update Profile"} className={"formBtn"} />
            </form>
            <span onClick={onLogOutClick} className={"formBtn cancelBtn logOut"}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;