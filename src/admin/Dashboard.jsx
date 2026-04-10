import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="admin-actions">
        {/* Result Dropdown */}
        <div className="admin-dropdown-wrapper">
          <button
            className="admin-action-btn"
            onClick={() => toggleDropdown("result")}
          >
            Result <i className="fas fa-chevron-down"></i>
          </button>
          {openDropdown === "result" && (
            <div className="admin-dropdown-menu">
              <Link to="/enter-result" className="admin-dropdown-item">
                New Result
              </Link>
              <Link to="/result-record" className="admin-dropdown-item">
                Result Records
              </Link>
              <Link to="/lucky-number-requests" className="admin-dropdown-item">
                Lucky Number Requests
              </Link>
            </div>
          )}
        </div>

        {/* Bazar Dropdown */}
        <div className="admin-dropdown-wrapper">
          <button
            className="admin-action-btn"
            onClick={() => toggleDropdown("bazar")}
          >
            <i className="fas fa-layer-group"></i> Bazar
          </button>
          {openDropdown === "bazar" && (
            <div className="admin-dropdown-menu">
              <Link to="/bazar-category" className="admin-dropdown-item">
                Category Setup
              </Link>
            </div>
          )}
        </div>

        {/* Floating Dropdown */}
        <div className="admin-dropdown-wrapper">
          <button
            className="admin-action-btn"
            onClick={() => toggleDropdown("floating")}
          >
            <i className="fas fa-bars"></i> Floating
          </button>
          {openDropdown === "floating" && (
            <div className="admin-dropdown-menu">
              <Link to="/floating-setting" className="admin-dropdown-item">
                New Floating
              </Link>
              {/* <Link to="/dashboard/floating-records" className="admin-dropdown-item">
                Floating Records
              </Link> */}
            </div>
          )}
        </div>

        {/* SEO Work Dropdown */}
        <div className="admin-dropdown-wrapper">
          <button
            className="admin-action-btn"
            onClick={() => toggleDropdown("seo")}
          >
            <i className="fas fa-globe"></i> SEO Work
          </button>
          {openDropdown === "seo" && (
            <div className="admin-dropdown-menu">
              <Link to="/game-seo-list" className="admin-dropdown-item">
                Game SEO List
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="disclaimer-card">
          <h3>DISCLAIMER</h3>
          <p>
            View this website is on your own risk. All the information shown on
            website is sponsored and we warn you that is only for entertainment
            purpose... We respect all country rules/laws... if you not agree with
            our site. Please quit site right now.
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
