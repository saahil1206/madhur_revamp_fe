import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./edit-profile.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "New password and confirm password do not match.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${apiBaseUrl}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      setMessage({ text: "Password changed successfully!", type: "success" });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ text: err.message || "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Change Password</h2>
      </div>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        {/* Old Password */}
        <div className="profile-field">
          <label>Old Password</label>
          <div className="profile-input-group">
            <i className="fas fa-lock"></i>
            <input
              type={showOld ? "text" : "password"}
              name="oldPassword"
              placeholder="Enter old password"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="profile-toggle-pw"
              onClick={() => setShowOld(!showOld)}
            >
              <i className={showOld ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="profile-field">
          <label>New Password</label>
          <div className="profile-input-group">
            <i className="fas fa-key"></i>
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="profile-toggle-pw"
              onClick={() => setShowNew(!showNew)}
            >
              <i className={showNew ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="profile-field">
          <label>Confirm Password</label>
          <div className="profile-input-group">
            <i className="fas fa-check-circle"></i>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="profile-toggle-pw"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              <i className={showConfirm ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </button>
          </div>
        </div>

        {message.text && (
          <p className={`profile-msg ${message.type}`}>{message.text}</p>
        )}

        <button type="submit" className="profile-save-btn" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
