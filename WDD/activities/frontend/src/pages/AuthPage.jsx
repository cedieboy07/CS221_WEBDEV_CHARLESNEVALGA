import React, { useState } from "react";
import Card from "../components/Card";
import LoginComponent from "../components/auth/LoginComponent";
import RegisterComponent from "../components/auth/RegisterComponent";

// Auth page with toggle between login and register
const AuthPage = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  const title = mode === "login" ? "Welcome back" : "Create your account";

  return (
    <div
      className="auth-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card title={title}>
        <div
          className="auth-toggle"
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            aria-pressed={mode === "login"}
            style={mode === "login" ? { fontWeight: "bold" } : {}}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            aria-pressed={mode === "register"}
            style={mode === "register" ? { fontWeight: "bold" } : {}}
          >
            Register
          </button>
        </div>
        {mode === "login" ? (
          <LoginComponent hideAuthLink={true} />
        ) : (
          <RegisterComponent />
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
