import React, {useEffect, useRef, useState} from 'react';
import {dbService, storageService} from "fbase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
    const [ nweet, setNweet ] = useState("");
    const [ nweets, setNweets ] = useState([]);
    const [ attachment, setAttachment ] = useState("");
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

        let attachmentUrl = "";
        if (attachment !== "") {
            // 파일 경로 참조 만들기
            const fileRef = ref(storageService, `${userObj.uid}/${uuidV4()}`);
            // storage 참조 경로로 파일 업로드 하기
            const uploadFile = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(uploadFile.ref);
        }

        const nweetPosting = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };

        await addDoc(collection(dbService, "nweets"), nweetPosting);
        setNweet("");
        setAttachment("");




        // try {
        //     const docRef = await addDoc(collection(dbService, "nweets"), {
        //         text: nweet,
        //         createdAt: Date.now(),
        //         creatorId: userObj.uid,
        //     });
        // } catch (err) {
        //     console.error("Error adding document: ", err);
        // }
        // setNweet("");
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
        setAttachment("");
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