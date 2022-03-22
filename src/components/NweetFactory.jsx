import React, {useRef, useState} from 'react';
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {dbService, storageService} from "../fbase";
import {v4 as uuidV4} from "uuid";
import {addDoc, collection} from "firebase/firestore";
import styles from "./Nweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory = ({ userObj }) => {
    const fileInput = useRef();
    const [ attachment, setAttachment ] = useState("");
    const [ nweet, setNweet ] = useState("");

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }
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
        <form onSubmit={onSubmit} className={styles.factoryForm}>
            <div className={styles.factoryWrap}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type={"text"}
                    placeholder={"What's on your mind?"}
                    maxLength={120}
                    className={styles.factoryInput}
                />
                <input type={"submit"} value="&rarr;" className={styles.factoryArrow}/>
            </div>
            <div className={styles.factoryFileWrap}>
                <label for={"attach-file"} className={styles.factoryLabel}>
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input
                    id={"attach-file"}
                    type={"file"}
                    accept={"image/*"}
                    onChange={onFileChange}
                    ref={fileInput}
                    className={styles.factoryFile}
                />
                {attachment && (
                    <div className={styles.factoryAttachment}>
                        <img src={attachment} alt={""} style={{ backgroundImage: attachment, }} />
                        <div className={styles.factoryClear} onClick={onClearImage}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default NweetFactory;