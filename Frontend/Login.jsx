import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginApi, registerOrg } from "../api/auth.api.js";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    organisationName: "",
    adminEmail: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginApi(loginForm);
      if (res.success) {
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerOrg({
        organisationName: registerForm.organisationName,
        adminEmail: registerForm.adminEmail,
        password: registerForm.password
      });
      if (res.success) {
        login(res.data.token, res.data.user);
        navigate("/dashboard");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="app-shell">
      <div className="card" style={{ maxWidth: "480px", margin: "3rem auto" }}>
        <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
          {isRegister ? "Create organisation" : "HRMS Login"}
        </h1>
        <p style={{ marginTop: 0, color: "#6b7280", fontSize: "0.9rem" }}>
          {isRegister
            ? "Spin up a new organisation and admin account in a few seconds."
            : "Sign in to manage employees, teams and logs for your organisation."}
        </p>

        {error && <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{error}</p>}

        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-row">
              <label>Email</label>
              <br />
              <input name="email" value={loginForm.email} onChange={handleLoginChange} />
            </div>
            <div className="form-row">
              <label>Password</label>
              <br />
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
              />
            </div>
            <button type="submit" className="btn" style={{ width: "100%", marginTop: "0.4rem" }}>
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <label>Organisation Name</label>
              <br />
              <input
                name="organisationName"
                value={registerForm.organisationName}
                onChange={handleRegisterChange}
              />
            </div>
            <div className="form-row">
              <label>Admin Email</label>
              <br />
              <input
                name="adminEmail"
                value={registerForm.adminEmail}
                onChange={handleRegisterChange}
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <br />
              <input
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
            </div>
            <button type="submit" className="btn" style={{ width: "100%", marginTop: "0.4rem" }}>
              Create organisation
            </button>
          </form>
        )}

        <button
          className="btn-secondary"
          style={{ marginTop: "0.8rem", width: "100%" }}
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? "Have an account? Login" : "New organisation? Register"}
        </button>
      </div>
    </div>
  );
}
