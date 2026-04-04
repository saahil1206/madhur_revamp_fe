import madhurLogo from "./admin-img/madhur-logo.png";

const AdminHeader = () => {
  return (
    <nav className="admin-navbar">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="navbar-logo">
          <img src={madhurLogo} alt="Madhur Logo" />
        </div>
        <div className="navbar-user">
          <div className="user-avatar">
            <img src={madhurLogo} alt="Profile" />
          </div>
          <span>Aditya Deshmukh</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
