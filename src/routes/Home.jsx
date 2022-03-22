import React, {useEffect, useState} from 'react';
import "./common.css";
import {dbService} from "fbase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({ userObj }) => {
    const [ nweets, setNweets ] = useState([]);

    useEffect(() => {
        getNweets();
    }, []);

    const getNweets = async () => {
        const q = query(collection(dbService, "nweets"));
        onSnapshot(q, (snapshot => {
            const nweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(nweetArr);
        }));
    }
    return (
        <div className={"container"}>
            <NweetFactory userObj={userObj} />
            <div className={"container homeWrap"}>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;