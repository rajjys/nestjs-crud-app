import React, { useEffect, useState } from "react";
import { api } from "../api";
import { styles } from "./sharedStyles";

export default function Bookmarks({ token }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [form, setForm] = useState({ title: "", link: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // More comprehensive URL regex
  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

  useEffect(() => {
    fetchBookmarks();

  }, [token]);

  async function fetchBookmarks() {
    try {
      const data = await api("/bookmarks", "GET", undefined, token);
      setBookmarks(data);
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!urlRegex.test(form.link)) newErrors.link = "Invalid URL format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api(`/bookmarks/${editingId}`, "PATCH", form, token);
        setSuccess("Bookmark updated successfully");
      } else {
        await api("/bookmarks", "POST", form, token);
        setSuccess("Bookmark added successfully");
      }
      setForm({ title: "", link: "", description: "" });
      setEditingId(null);
      fetchBookmarks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors({ server: err.message });
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      await api(`/bookmarks/${id}`, "DELETE", undefined, token);
      setSuccess("Bookmark deleted successfully");
      fetchBookmarks();
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bookmarks</h2>
      
      {success && <div style={styles.success}>{success}</div>}
      {errors.server && <div style={styles.error}>{errors.server}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
            {errors.title && <div style={styles.error}>{errors.title}</div>}
          </div>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Link *"
              value={form.link}
              onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
            />
            {errors.link && <div style={styles.error}>{errors.link}</div>}
          </div>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            style={{ ...styles.button, backgroundColor: "#1877f2", color: "white" }}
          >
            {editingId ? "Update Bookmark" : "Add Bookmark"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", link: "", description: "" });
              }}
              style={styles.button}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Loading bookmarks...</div>
      ) : (
        <div>
          {bookmarks.map(b => (
            <div key={b.id} style={styles.bookmarkCard}>
              <a href={b.link} style={styles.bookmarkLink} target="_blank" rel="noopener noreferrer">
                <div style={styles.thumbnail}>
                  {/* Placeholder for thumbnail - could add dynamic favicon */}
                  <span>🌐</span>
                </div>
                <div style={styles.content}>
                  <h3 style={styles.bookmarkTitle}>{b.title}</h3>
                  {b.description && (
                  <p style={styles.bookmarkDescription}>{b.description}</p>
                  )}
                  <div style={styles.bookmarkActions}>
                    <button
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditingId(b.id);
                        setForm({
                          title: b.title,
                          link: b.link,
                          description: b.description || ""
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteButton }}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(b.id);
                      }}> Delete</button>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}