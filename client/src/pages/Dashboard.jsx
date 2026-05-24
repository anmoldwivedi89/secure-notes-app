import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { clearAuth } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    // Auto-dismiss success after 3s, errors after 5s
    const delay = type === "success" ? 3000 : 5000;
    setTimeout(() => setMessage({ type: "", text: "" }), delay);
  };

  const fetchData = async () => {
    try {
      const [profileRes, notesRes] = await Promise.all([
        api.get("/users/profile"),
        api.get("/notes"),
      ]);
      setUser(profileRes.data.data);
      setNotes(notesRes.data.data);
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNoteChange = (e) => {
    setNoteForm({ ...noteForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.post("/notes", noteForm);
      setNotes((prev) => [data.data, ...prev]);
      setNoteForm({ title: "", content: "" });
      showMessage("success", data.message || "Note created successfully");
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditForm({ title: note.title, content: note.content });
    setMessage({ type: "", text: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "" });
  };

  const handleUpdateNote = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.put(`/notes/${id}`, editForm);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? data.data : note))
      );
      setEditingId(null);
      setEditForm({ title: "", content: "" });
      showMessage("success", data.message || "Note updated successfully");
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setMessage({ type: "", text: "" });

    try {
      const { data } = await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (editingId === id) cancelEdit();
      showMessage("success", data.message || "Note deleted successfully");
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          {user && (
            <p className="subtitle">
              Welcome, {user.name} ({user.email}) — {user.role}
            </p>
          )}
        </div>
        <button type="button" className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <section className="card">
        <h2>Create Note</h2>
        <form className="note-form" onSubmit={handleCreateNote}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={noteForm.title}
              onChange={handleNoteChange}
              placeholder="Note title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={noteForm.content}
              onChange={handleNoteChange}
              placeholder="Note content"
              rows={4}
              required
            />
          </div>

          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting && !editingId ? "Creating..." : "Add Note"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>My Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="empty">No notes yet. Create your first note above.</p>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <article key={note._id} className="note-item">
                {editingId === note._id ? (
                  <form
                    className="edit-form"
                    onSubmit={(e) => handleUpdateNote(e, note._id)}
                  >
                    <div className="form-group">
                      <label htmlFor={`edit-title-${note._id}`}>Title</label>
                      <input
                        id={`edit-title-${note._id}`}
                        name="title"
                        type="text"
                        value={editForm.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`edit-content-${note._id}`}>Content</label>
                      <textarea
                        id={`edit-content-${note._id}`}
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="note-actions">
                      <button
                        type="submit"
                        className="btn primary small"
                        disabled={submitting}
                      >
                        {submitting ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="btn secondary small"
                        onClick={cancelEdit}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="note-content">
                      <h3>{note.title}</h3>
                      <p>{note.content}</p>
                      <small>
                        Updated {new Date(note.updatedAt).toLocaleString()}
                      </small>
                    </div>
                    <div className="note-actions">
                      <button
                        type="button"
                        className="btn edit"
                        onClick={() => startEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;


