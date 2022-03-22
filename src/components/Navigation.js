import React from 'react';
import {NavLink} from "react-router-dom";

const Navigation = ({ userObj }) => {
    return (
        <nav>
            <NavLink exact to={"/"}>Home</NavLink>
            {userObj && <NavLink to={"/profile"}>{userObj.displayName ? userObj.displayName : "USER"} 님의 Profile</NavLink>}
        </nav>
    );
};

export default Navigation;