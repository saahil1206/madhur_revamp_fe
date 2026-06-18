import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin-login.css";
import madhurLogo from "./admin-img/madhur-logo.avif";
// import madhurLogo from "./admin-img/madhur-logo.png";
import { storeAdminSession } from "./adminSession";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const logoutReason = sessionStorage.getItem("admin_logout_reason");
    if (logoutReason) {
      setError(logoutReason);
      sessionStorage.removeItem("admin_logout_reason");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: username.trim(),
          passWord: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      storeAdminSession(data.token, data.user || {});
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to login right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Top Logo */}
      <div className="top-logo">
        <img src={madhurLogo} alt="Madhur Logo" />
      </div>

      {/* Glowing Circle with Form */}
      <div className="login-circle-wrapper">
        <div className="login-circle-glow"></div>
        <div className="login-form-inner">
          <h2>Login</h2>

          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Username */}
            <div className="admin-input-group">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="admin-input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                ></i>
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : "Submit"}
            </button>
            {error ? <p className="admin-login-error">{error}</p> : null}
          </form>

          {/* Register Now */}
          {/* <a href="/register" className="register-link">
            Register Now
          </a> */}
        </div>
      </div>

      {/* Footer */}
      <div className="admin-login-footer">
        Satta-Matka @ All rights reserved
      </div>
    </div>
  );
};

export default Login;
