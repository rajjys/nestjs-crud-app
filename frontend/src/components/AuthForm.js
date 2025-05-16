import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function AuthForm({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Reset form and errors when switching modes
    setFormData({ firstname: "", lastname: "", email: "", password: "" });
    setErrors({});
    setShowSuccess(false);
  }, [isSignup]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email address";
    }
    
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (isSignup) {
      if (!formData.firstname.trim()) newErrors.firstName = "Required";
      if (!formData.lastname.trim()) newErrors.lastName = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      const endpoint = `/auth/${isSignup ? "signup" : "signin"}`;
      const data = await api(endpoint, "POST", isSignup ? formData : {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstname,
        lastName: formData.lastname
      });
      if (isSignup) {
        setShowSuccess(true);
      } else {
        setToken(data.access_token);
      }
    } catch (err) {
      setErrors({ server: err.message || "Authentication failed" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        
        {showSuccess && (
          <div style={styles.successMessage}>
            ✅ Account created successfully! You can now login.
          </div>
        )}

        {errors.server && <div style={styles.error}>{errors.server}</div>}

        {isSignup && (
          <div style={styles.nameContainer}>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="First Name"
                value={formData.firstname}
                onChange={e => setFormData({ ...formData, firstname: e.target.value })}
              />
              {errors.firstName && <span style={styles.errorText}>{errors.firstName}</span>}
            </div>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastname}
                onChange={e => setFormData({ ...formData, lastname: e.target.value })}
              />
              {errors.lastName && <span style={styles.errorText}>{errors.lastName}</span>}
            </div>
          </div>
        )}

        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <button
          style={submitting ? { ...styles.button, ...styles.submitting } : styles.button}
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Processing..." : (isSignup ? "Sign Up" : "Sign In")}
        </button>

        <button
          type="button"
          style={styles.switchButton}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    transition: "all 0.3s ease",
  },
  title: {
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
  },
  nameContainer: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr 1fr",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#1877f2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "1rem",
  },
  submitting: {
    backgroundColor: "#95c0ff",
    cursor: "not-allowed",
  },
  switchButton: {
    width: "100%",
    background: "none",
    border: "none",
    color: "#1877f2",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "1rem",
    padding: "0.5rem",
    ":hover": {
      textDecoration: "underline",
    },
  },
  error: {
    color: "#ff4444",
    backgroundColor: "#ffebee",
    padding: "0.8rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  errorText: {
    color: "#ff4444",
    fontSize: "0.8rem",
    marginTop: "0.3rem",
    display: "block",
  },
  successMessage: {
    color: "#00C851",
    backgroundColor: "#e8f5e9",
    padding: "0.8rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
};