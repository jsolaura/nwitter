import React from 'react';
import { authService } from "fbase";
import {Redirect, useHistory, useLocation} from "react-router-dom";

const Profile = () => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut()
            .then(history.push("/"));
    };
    return (
        <button onClick={onLogOutClick}>Log Out</button>
    );
};

export default Profile;