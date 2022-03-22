import React, {useEffect, useState} from 'react';
import {authService, dbService} from "fbase";
import {collection, getDocs, onSnapshot, orderBy, query, where} from "firebase/firestore"
import { updateProfile } from "firebase/auth";
import {Redirect, useHistory, useLocation} from "react-router-dom";

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
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((document) => {
        //     console.log(document.id, " => ", document.data());
        // })

    };

    useEffect(() => {
        getMyNweets();
    }, [userObj])

    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange}
                   type={"text"}
                   placeholder={"Display Name"}
                   value={newDisplayName}
            />
            <input type={"submit"} value={"Update Profile"} />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;