import React, { useEffect, useState, useRef } from "react";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import pin from "../assests/pin.png";

const Modal = ({ closeModal, notes, status, setNotes, db, reset }) => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    pinned: false,
    id: "",
  });

  const [Loading, setLoading] = useState(true);
  const [undo, setUndo] = useState(false);
  const undoRef = useRef(undo);
  // const descriptionref = useRef(note.description);

  useEffect(() => {
    if (!Loading) {
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading]);

  useEffect(() => {
    setNote({
      ...note,
      title: notes[status.index].title,
      description: notes[status.index].description,
      pinned: notes[status.index].pinned,
      id: notes[status.index].id,
    });
    document.addEventListener("keydown", escapeModal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoteChange = (e) => {
    e.preventDefault();
    const { value, id } = e.target;
    if (id === "title1") {
      setNote({ ...note, title: value });
    } else if (id === "description1") {
      setNote({ ...note, description: value });
      e.target.style.height = "inherit";
      e.target.style.height = `${e.target.scrollHeight}px`;
    } else if (id === "pin") {
      if (!!note.description.length) {
        setNote((prevcheck) => ({ ...note, pinned: !prevcheck.pinned }));
        setLoading(false);
      } else {
        document.querySelector(".errormodal").classList.toggle("hiddenmodal");
        setTimeout(() => {
          document.querySelector(".errormodal").classList.toggle("hiddenmodal");
        }, 1000);
      }

      // closeModal();
    }
  };

  const update = async () => {
    const userDoc = doc(db, "notes", note.id);
    setLoading(true);
    await updateDoc(userDoc, note);
  };

  const updateNote = (e) => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    if (note.description !== "") {
      update();
      reset();
      closeModal();
      // let ind = parseInt(status.index);
      // setNotes(
      //   notes.map((n, index) => {
      //     if (index === ind) {
      //       return note;
      //     } else {
      //       return n;
      //     }
      //   })
      // );
    } else {
      document.querySelector(".errormodal").classList.toggle("hiddenmodal");
      setTimeout(() => {
        document.querySelector(".errormodal").classList.toggle("hiddenmodal");
      }, 1000);
    }
  };

  const deleteNote = async (e) => {
    const userDoc = doc(db, "notes", note.id);
    reset();
    closeModal();
    setUndo(false);
    await deleteDoc(userDoc, note);
    // let ind = parseInt(status.index);
    // const newnote = notes.filter((n, index) => index !== ind);
    // setNotes(newnote);
  };

  useEffect(() => {
    undoRef.current = undo;
  }, [undo]);

  const handleDelete = (e) => {
    e.preventDefault();
    setUndo(true);
    setTimeout(() => {
      if (undoRef.current) {
        deleteNote();
      } else {
        setUndo(false);
      }
    }, 2500);
  };

  const escapeModal = (e) => {
    if (e.key === "Escape") {
      console.log("closed");
      closeModal();
    }
  };

  const closeicon = () => (
    <div className="cross" name="times" onClick={closeModal}>
      X
    </div>
  );

  return (
    <div className="overlay">
      <form className="content">
        {!!note.description.length && closeicon()}
        <button className="pin" onClick={handleNoteChange} id="pin">
          <img
            id="pin"
            src={pin}
            alt="pin note"
            className={`${note.pinned ? "pinned" : ""}`}
          />
        </button>
        <input
          onChange={handleNoteChange}
          value={note.title}
          id="title1"
        ></input>
        <textarea
          onChange={handleNoteChange}
          value={note.description}
          id="description1"
        ></textarea>
        <div className="modalbuttons">
          <button type="submit" onClick={updateNote} className="update">
            Update
          </button>
          {!undo ? (
            <button type="submit" onClick={handleDelete} className="delete">
              Delete
            </button>
          ) : (
            <button className="undo" onClick={() => setUndo(false)}>
              Undo
            </button>
          )}
        </div>
        <div className="errormodal hiddenmodal">
          Description cannot be empty
        </div>
      </form>
    </div>
  );
};

export default Modal;
