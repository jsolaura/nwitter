import React, {useEffect, useRef, useState} from 'react';
import {dbService, storageService} from "fbase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
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
        <>
        <NweetFactory userObj={userObj} />
        <div>
            {nweets.map((nweet) => (
                <Nweet
                    key={nweet.id}
                    nweetObj={nweet}
                    isOwner={nweet.creatorId === userObj.uid} />
            ))}
        </div>
        </>
    );
};

export default Home;