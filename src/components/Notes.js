import React, { useEffect, useState, useRef } from "react";
import List from "./List";
import Modal from "./Modal";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import db from "../firebase";

function Notes() {
  //hooks
  const [note, setNote] = useState({
    title: "",
    description: "",
    pinned: false,
    id: "",
  });
  const [notes, setNotes] = useState([]);
  //used for setting note description height as dynamic
  const descriptionref = useRef(null);
  //used to see if modal is open or not
  const [status, setStatus] = useState({ status: false, index: -1 });
  useEffect(() => {
    console.log(notes);
  }, [notes]);
  //database reference
  const colRef = collection(db, "notes");

  useEffect(() => {
    const firstBatch = query(
      colRef,
      orderBy("pinned", "desc"),
      orderBy("id", "asc")
    );
    var unsubscribe = onSnapshot(
      firstBatch,
      (fetchednotes) => {
        console.log("fetch");
        console.log(
          fetchednotes.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setNotes(
          fetchednotes.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      },
      (error) => {
        console.log(error);
      }
    );

    if (descriptionref) {
      descriptionref.current.style.minHeight = "2rem";
    }
    //
    return function cleanup() {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setNote({ title: "", description: "", pinned: false, id: "" });
  };

  const handleNoteChange = (e) => {
    const { value, id } = e.target;
    if (id === "title") {
      setNote({ ...note, title: value });
    } else if (id === "description") {
      setNote({ ...note, description: value });
      e.target.style.height = "inherit";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    if (note.description !== "") {
      setNotes([...notes, { ...note, id: note.id }]);
      const added = await addDoc(colRef, note);
      const updateDocId = doc(db, "notes", added.id);
      await updateDoc(updateDocId, {
        id: added.id,
      });
      reset();
    } else {
      document.querySelector(".error").classList.toggle("hidden");
      setTimeout(() => {
        document.querySelector(".error").classList.toggle("hidden");
      }, 1000);
    }
  };

  const notepopup = (e) => {
    const ind = e.target.getAttribute("name");
    setStatus({ status: true, index: ind });
  };

  return (
    <div className="notes">
      <div className="error hidden">Description cannot be empty</div>
      <form className="newnote">
        <input
          placeholder="Title"
          onChange={handleNoteChange}
          id="title"
          value={note.title}
        ></input>
        <textarea
          placeholder="take a note"
          onChange={handleNoteChange}
          id="description"
          value={note.description}
          ref={descriptionref}
          cols="2"
        ></textarea>
        <button type="submit" onClick={submitNote} id="submit">
          Make Note
        </button>
      </form>
      <List notes={notes} notepopup={notepopup}></List>
      {status.status && (
        <Modal
          closeModal={() => setStatus({ ...status, status: false })}
          notes={notes}
          setNotes={setNotes}
          status={status}
          db={db}
          reset={reset}
        ></Modal>
      )}
    </div>
  );
}

export default Notes;
