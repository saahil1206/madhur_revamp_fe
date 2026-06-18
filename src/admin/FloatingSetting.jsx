import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingSetting = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [isVisible, setIsVisible] = useState(false);
  const [whatsappName, setWhatsappName] = useState("Whatsapp");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [telegramName, setTelegramName] = useState("Telegram");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const parseFloatingValue = (value) => {
    if (!value) return {};
    if (typeof value === "object") return value;
    try {
      return JSON.parse(value);
    } catch (_error) {
      return { whatsappUrl: value };
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/adminlogin");
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
        const parsedValue = parseFloatingValue(data.setting_value);
        setIsVisible(Number(data.status) === 1);
        setWhatsappName(parsedValue.whatsappName || data.setting_name || "Whatsapp");
        setWhatsappUrl(parsedValue.whatsappUrl || "");
        setTelegramName(parsedValue.telegramName || "Telegram");
        setTelegramUrl(parsedValue.telegramUrl || "");
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
      navigate("/adminlogin");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        whatsappName,
        whatsappUrl,
        telegramName,
        telegramUrl,
      };
      const response = await fetch(`${apiBaseUrl}/api/settings/floating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          setting_name: whatsappName,
          setting_value: JSON.stringify(payload),
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
            placeholder="Whatsapp label"
            value={whatsappName}
            onChange={(e) => setWhatsappName(e.target.value)}
          />
          <input
            type="text"
            className="floating-input floating-input-wide"
            placeholder="Whatsapp URL"
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
          />
          <input
            type="text"
            className="floating-input"
            placeholder="Telegram label"
            value={telegramName}
            onChange={(e) => setTelegramName(e.target.value)}
          />
          <input
            type="text"
            className="floating-input floating-input-wide"
            placeholder="Telegram URL"
            value={telegramUrl}
            onChange={(e) => setTelegramUrl(e.target.value)}
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
