import React from 'react';
import {NavLink} from "react-router-dom";

const Navigation = ({ userObj }) => {
    if (userObj.displayName === null) {
        const name = userObj.email.split('@')[0];
        userObj.displayName = name;
    }
    return (
        <nav>
            <NavLink exact to={"/"}>Home</NavLink>
            <NavLink to={"/profile"}>{userObj.displayName} 님의 Profile</NavLink>
        </nav>
    );
};

export default Navigation;