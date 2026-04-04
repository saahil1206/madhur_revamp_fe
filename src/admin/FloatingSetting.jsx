import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingSetting = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [isVisible, setIsVisible] = useState(false);
  const [settingName, setSettingName] = useState("Whatsapp");
  const [settingValue, setSettingValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiBaseUrl}/api/settings/floating`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to load setting");
        setIsVisible(Number(data.status) === 1);
        setSettingName(data.setting_name || "Whatsapp");
        setSettingValue(data.setting_value || "");
      } catch (err) {
        setError(err.message || "Failed to load setting");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBaseUrl, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/settings/floating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          setting_name: settingName,
          setting_value: settingValue,
          status: isVisible ? 1 : 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to save setting");
      setMessage("Floating setting updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save setting");
    } finally {
      setSaving(false);
    }
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
            value={settingName}
            onChange={(e) => setSettingName(e.target.value)}
          />
          <input
            type="text"
            className="floating-input floating-input-wide"
            placeholder="Enter URL"
            value={settingValue}
            onChange={(e) => setSettingValue(e.target.value)}
          />
          <button type="submit" className="btn-submit" disabled={saving || loading}>
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
      {loading ? <p style={{ color: "#333", marginTop: 10 }}>Loading...</p> : null}
      {message ? <p style={{ color: "#2f9e44", marginTop: 10 }}>{message}</p> : null}
      {error ? <p style={{ color: "#c92a2a", marginTop: 10 }}>{error}</p> : null}

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
