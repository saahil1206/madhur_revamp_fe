import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin-login.css";
import madhurLogo from "./admin-img/madhur-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
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
            <button type="submit" className="admin-submit-btn">
              Submit
            </button>
          </form>

          {/* Register Now */}
          <a href="/register" className="register-link">
            Register Now
          </a>
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
