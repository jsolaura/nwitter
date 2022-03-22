import React, {useState} from 'react';
import {doc, deleteDoc, updateDoc, getFirestore} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage"
import { storageService } from "fbase";
import { dbService } from "fbase";
import styles from "./Nweet.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

    // delete
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            // await deleteDoc(NweetTextRef);
            const urlRef = ref(storageService, nweetObj.attachmentUrl);
            await deleteDoc(doc(getFirestore(), `nweets/${nweetObj.id}`));
            await deleteObject(urlRef);
        }
    }

    const toggleEditing = async () => {
        setEditing((prev) => !prev);
    }

    // edit submit
    const onSubmitEdit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
             text: newNweet,
        });
        setEditing(false);
    }

    // editing value to target
    const onChangeEdit = (event) => {
        const {target: {value}} = event;
        setNewNweet(value);
    }

    return (
        <div className={`container ${styles.nweetContainer}`}>
            {editing ? (
                <>
                    {isOwner &&
                        <>
                        <form onSubmit={onSubmitEdit} className={` ${styles.nweetEdit}`}>
                            <input type={"text"}
                                   onChange={onChangeEdit}
                                   placeholder={"Edit your nweet"}
                                   value={newNweet}
                                   className={`formInput ${styles.nweetEditInput}`}
                                   autoFocus
                                   required
                            />
                            <input type={"submit"} value={"Update nweet"} className={`formBtn ${styles.nweetEditBtn}`} />
                        </form>
                        <span onClick={toggleEditing} className={"formBtn cancelBtn"}>Cancel</span>
                        </>
                    }
                </>
            ) : (
                <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt={""}/>}
                {isOwner && (
                    <div className={styles.nweetAction}>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                    </div>
                )}
                </>
            )}
        </div>
    );
};

export default Nweet;