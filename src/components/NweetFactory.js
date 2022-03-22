import React, {useRef, useState} from 'react';
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {dbService, storageService} from "../fbase";
import {v4 as uuidV4} from "uuid";
import {addDoc, collection} from "firebase/firestore";

const NweetFactory = ({ userObj }) => {
    const fileInput = useRef();
    const [ attachment, setAttachment ] = useState("");
    const [ nweet, setNweet ] = useState("");

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
    );
};

export default NweetFactory;