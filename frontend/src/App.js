import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Profile from "./components/Profile";
import Bookmarks from "./components/Bookmarks";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  function handleSetToken(t) {
    setToken(t);
    localStorage.setItem("token", t);
  }

  function handleLogout() {
    setToken("");
    localStorage.removeItem("token");
  }

  if (!token) return <AuthForm setToken={handleSetToken} />;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Profile token={token} handleLogout={handleLogout}/>
      <Bookmarks token={token} />
    </div>
  );
}

export default App;