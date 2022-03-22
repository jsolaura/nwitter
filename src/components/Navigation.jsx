import React from 'react';
import styles from "./Header.module.css";
import {NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
    return (
        <nav>
            <ul className={styles.gnbContainer}>
                <li>
                    <NavLink exact to={"/"} className={styles.navHome}>
                        <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size={"2x"} />
                    </NavLink>
                </li>
                <li>
                    {userObj &&
                        <NavLink to={"/profile"} className={styles.navProfile}>
                            <FontAwesomeIcon icon={faUser} color={"#04AAff"} size={"2x"} />
                            <span className={styles.navProfileText}>{userObj.displayName ? userObj.displayName : "USER"} 님의 Profile</span>
                        </NavLink>}

                </li>
            </ul>
        </nav>
    );
};

export default Navigation;