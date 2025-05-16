// Profile Component
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { styles } from "./sharedStyles";

export default function Profile({ token , handleLogout}) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api("/users/me", "GET", undefined, token).then(u => {
      setUser(u);
      setForm({ firstName: u.firstName || "", lastName: u.lastName || "" });
      setLoading(false);
    });
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave(e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const updated = await api("/users", "PATCH", form, token);
      setUser(updated);
      setEdit(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrors({ server: err.message });
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <div style={styles.profileAvatar}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div style={styles.profileInfo}>
          {loading? "Loading" : 
          <div style={styles.profileName}>
            {user?.firstName} {user?.lastName}
          </div>}
          <div style={styles.profileEmail}>{user?.email}</div>
        </div>
        <div style={styles.profileActions}>
          <button style={{...styles.button, ...styles.editButton}} onClick={() => setEdit(!edit)}>
            {edit ? "Cancel" : "Edit"}
          </button>
          <button 
            style={{ ...styles.button, ...styles.deleteButton, color: "#ff4444" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {edit && (
        <form onSubmit={handleSave} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="First Name"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
              />
              {errors.firstName && <span style={styles.errorText}>{errors.firstName}</span>}
            </div>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Last Name"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
              />
              {errors.lastName && <span style={styles.errorText}>{errors.lastName}</span>}
            </div>
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.primaryButton}>
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEdit(false)}
                style={styles.secondaryButton}
              >
                Cancel
              </button>
            </div>
          </form>
      )}
    </div>
  );
}
