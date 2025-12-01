import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  useEffect(() => {
    if (!token) navigate("/login");
    else loadNotes();
  }, []);

  const loadNotes = async () => {
    const res = await fetch(" https://notesapp-backend-obqb.onrender.com/notes/my", {
      headers: { token },
    });
    const data = await res.json();
    setNotes(data);
  };

  const saveNote = async () => {
    if (!text.trim()) return;

    if (editId) {
      // Update note
      await fetch(`https://notesapp-backend-obqb.onrender.com/notes/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ text }),
      });
      setEditId(null);
    } else {
      // Add new note
      await fetch("https://notesapp-backend-obqb.onrender.com/notes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ text }),
      });
    }

    setText("");
    loadNotes();
  };

  const editNote = (note) => {
    setText(note.text);
    setEditId(note._id);
  };

  const deleteNote = async (id) => {
    await fetch(`https://notesapp-backend-obqb.onrender.com/notes/delete/${id}`, {
      method: "DELETE",
      headers: { token },
    });
    loadNotes();
  };

  return (
    <div className="container">
      <h2>Welcome, {name}</h2>

      <textarea
        placeholder="Write your note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={saveNote}>{editId ? "Update Note" : "Add Note"}</button>

      <h3>Your Notes</h3>

      {notes.length === 0 ? (
        <p>No notes yet. Add one!</p>
      ) : (
        notes.map((n) => (
          <div key={n._id} className="note">
            <p>{n.text}</p>
            <div className="note-buttons" >
              <button onClick={() => editNote(n)}>Edit</button>
              <button onClick={() => deleteNote(n._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
