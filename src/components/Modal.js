import React, { useEffect, useState } from "react";
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
    window.addEventListener("keydown", escapeModal);
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
      setNote((prevcheck) => ({ ...note, pinned: !prevcheck.pinned }));
      setLoading(false);
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
    e.preventDefault();
    const userDoc = doc(db, "notes", note.id);
    await deleteDoc(userDoc, note);
    reset();
    closeModal();

    // let ind = parseInt(status.index);
    // const newnote = notes.filter((n, index) => index !== ind);
    // setNotes(newnote);
  };

  const escapeModal = (e) => {
    if (e.key === "Escape") {
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
        {closeicon()}
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
          <button type="submit" onClick={deleteNote} className="delete">
            Delete
          </button>
        </div>
        <div className="errormodal hiddenmodal">
          Description cannot be empty
        </div>
      </form>
    </div>
  );
};

export default Modal;
