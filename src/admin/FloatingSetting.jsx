import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingSetting = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Floating setting submitted");
  };

  return (
    <>
      {/* Top Bar */}
      <div className="record-top-bar">
        <h2 className="record-title">Floating Setting</h2>
        <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Floating Form Row */}
      <form onSubmit={handleSubmit}>
        <div className="floating-row">
          <div className="floating-toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => setIsVisible(!isVisible)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="floating-label">Floating Visibility</span>
          </div>
          <input
            type="text"
            className="floating-input"
            placeholder="Whatsapp"
            defaultValue="Whatsapp"
          />
          <input
            type="text"
            className="floating-input floating-input-wide"
            placeholder="Enter URL"
            defaultValue="whatsapp+channel&rlz=lC1VlQF_enIN1134IN1134&oq"
          />
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </div>
      </form>

      {/* Disclaimer */}
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

export default FloatingSetting;
