import React from "react";

function List({ notes, notepopup }) {
  return (
    <div className="list">
      {notes.map((note, index) => {
        return (
          <div onClick={notepopup} key={index} className="note" name={index}>
            <h2
              name={index}
              className={`notetitle ${note.title && "notetitlepresent "}`}
            >
              {note.title}
            </h2>
            <div name={index} className="notedescription">
              {note.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default List;
