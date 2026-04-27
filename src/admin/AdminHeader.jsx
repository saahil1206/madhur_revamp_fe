import { useState, useRef, useEffect } from "react";
import madhurLogo from "./admin-img/madhur-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { clearAdminSession } from "./adminSession";

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const displayName = user?.username || "Admin";
  const profilePhoto = user?.photo || user?.img || madhurLogo;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/adminlogin");
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/dashboard" className="navbar-logo" title="Go to Dashboard">
            <img src={madhurLogo} alt="Madhur Logo" />
          </Link>
          <div className="navbar-user-wrapper" ref={dropdownRef}>
            <div
              className="navbar-user"
              style={{ cursor: "pointer" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">
                <img src={profilePhoto} alt="Profile" />
              </div>
              <span>{displayName}</span>
              <i className={`fas fa-chevron-down ${dropdownOpen ? "rotated" : ""}`}></i>
            </div>

            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div
                  className="navbar-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/edit-profile");
                  }}
                >
                  <i className="fas fa-user-edit"></i>
                  <span>Edit Profile</span>
                </div>
                <div
                  className="navbar-dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/change-password");
                  }}
                >
                  <i className="fas fa-key"></i>
                  <span>Change Password</span>
                </div>
                <div className="navbar-dropdown-divider"></div>
                <div
                  className="navbar-dropdown-item logout"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h3>Are you sure?</h3>
            <p>You will be logged out of your account.</p>
            <div className="logout-modal-buttons">
              <button
                className="logout-modal-btn cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="logout-modal-btn confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
