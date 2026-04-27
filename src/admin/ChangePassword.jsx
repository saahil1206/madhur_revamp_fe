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

  const emojiRegex = /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/u;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");

    setFormData({ ...formData, [name]: sanitizedValue });

    if (sanitizedValue !== value) {
      setMessage({ text: "Emoji are not allowed in password fields.", type: "error" });
    } else if (message.text === "Emoji are not allowed in password fields.") {
      setMessage({ text: "", type: "" });
    }
  };

  const isStrongPassword = (value) => {
    // 8-20 chars, one uppercase, one lowercase, one number, one special char, no spaces
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,20}$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    if (
      emojiRegex.test(formData.oldPassword) ||
      emojiRegex.test(formData.newPassword) ||
      emojiRegex.test(formData.confirmPassword)
    ) {
      setMessage({ text: "Emoji are not allowed in password fields.", type: "error" });
      return;
    }

    if (!isStrongPassword(formData.newPassword)) {
      setMessage({
        text: "Password must be 8-20 chars with uppercase, lowercase, number and special character.",
        type: "error",
      });
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage({ text: "New password must be different from old password.", type: "error" });
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
              maxLength={20}
              title="Format: 8-20 characters, including uppercase, lowercase, number, and special character."
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
              maxLength={20}
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
