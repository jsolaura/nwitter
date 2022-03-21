import React, {useEffect, useRef, useState} from 'react';
import { dbService } from "fbase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";

import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
    const [ nweet, setNweet ] = useState("");
    const [ nweets, setNweets ] = useState([]);
    const [ attachment, setAttachment ] = useState();
    const fileInput = useRef();

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
        // const q = query(collection(dbService, "nweets"));
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((document) => {
        //     const nweetObj = {
        //         ...document.data(),
        //         id: document.id,
        //     }
        //     setNweets(prev => [nweetObj, ...prev]);
        // })
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            // const docRef = await addDoc(collection(dbService, "nweets"), {
            //     text: nweet,
            //     createdAt: Date.now(),
            //     creatorId: userObj.uid,
            // });
        } catch (err) {
            // console.error("Error adding document: ", err);
        }
        setNweet("");
    }
    const onChange = (event) => {
        const { target: { value, } } = event
        setNweet(value);
    }

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    }

    const onClearImage = () => {
        setAttachment(null);
        fileInput.current.value = "";
    };


    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type={"text"} placeholder={"What's on your mind?"} maxLength={120}/>
            <input type={"file"} onChange={onFileChange} accept={"image/*"} ref={fileInput} />
            <input type={"submit"} value={"Nweet"}/>
            {attachment && (
                <div>
                    <img src={attachment} width={80} height={80} alt={""} />
                    <button onClick={onClearImage}>Clear</button>
                </div>
            )}
        </form>
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