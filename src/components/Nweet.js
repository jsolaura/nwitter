import React, {useState} from 'react';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

    // delete
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await deleteDoc(NweetTextRef);
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
        <div>
            {editing ? (
                <>
                    {isOwner &&
                        <>
                        <form onSubmit={onSubmitEdit}>
                            <input type={"text"} onChange={onChangeEdit} placeholder={"Edit your nweet"} value={newNweet} required />
                            <input type={"submit"} value={"Update nweet"} />
                        </form>
                        <button onClick={toggleEditing}>Cancle</button>
                        </>
                    }
                </>
            ) : (
                <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width={80} height={80} alt={""}/>}

                {isOwner && (
                    <>
                    <button onClick={toggleEditing}>Edit</button>
                    <button onClick={onDeleteClick}>Delete</button>
                    </>
                )}
                </>
            )}

        </div>
    );
};

export default Nweet;