import madhurLogo from "./admin-img/madhur-logo.png";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
  const displayName = user?.username || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="navbar-logo" title="Go to Dashboard">
          <img src={madhurLogo} alt="Madhur Logo" />
        </Link>
        <div className="navbar-user" style={{ cursor: "pointer" }} onClick={handleLogout} title="Logout">
          <div className="user-avatar">
            <img src={madhurLogo} alt="Profile" />
          </div>
          <span>{displayName}</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
