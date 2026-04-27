import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BazarGuessingSetting = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiBaseUrl}/api/bazar-guessing`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to load bazar guessing");

        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          bazarId: item.bazarId,
          name: item.name,
          digits: String(item.digitsText || "").replace(/\D/g, "").slice(0, 4).padEnd(4, "0"),
        }));
        setRows(mapped);
      } catch (err) {
        setError(err.message || "Failed to load bazar guessing");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiBaseUrl]);

  const handleChangeDigits = (bazarId, value) => {
    const next = String(value || "").replace(/\D/g, "").slice(0, 4);
    setRows((prev) => prev.map((row) => (row.bazarId === bazarId ? { ...row, digits: next } : row)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      navigate("/adminlogin");
      return;
    }

    const invalid = rows.find((row) => String(row.digits || "").length !== 4);
    if (invalid) {
      setError(`Please enter exactly 4 digits for ${invalid.name}.`);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/bazar-guessing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: rows.map((row) => ({
            bazarId: row.bazarId,
            digits: row.digits,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to save bazar guessing");

      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        bazarId: item.bazarId,
        name: item.name,
        digits: String(item.digitsText || "").replace(/\D/g, "").slice(0, 4).padEnd(4, "0"),
      }));
      setRows(mapped);
      setMessage("Bazar guessing updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save bazar guessing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="record-top-bar">
        <h2 className="record-title">Bazar Guessing Setting</h2>
        <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSave} className="record-filters">
        <div className="row">
          {(rows || []).map((row) => (
            <div className="col-md-6 col-lg-4 mt-2" key={row.bazarId}>
              <label className="form-label-custom">{row.name}</label>
              <input
                type="text"
                inputMode="numeric"
                className="custom-input"
                placeholder="Enter 4 digits"
                maxLength={4}
                value={row.digits}
                onChange={(e) => handleChangeDigits(row.bazarId, e.target.value)}
              />
            </div>
          ))}

          <div className="col-md-12 mt-3">
            <button className="btn-submit" type="submit" disabled={saving || loading}>
              {saving ? "Saving..." : "Save Guessing"}
            </button>
          </div>
        </div>
      </form>

      {loading ? <p>Loading...</p> : null}
      {message ? <p style={{ color: "#2f9e44" }}>{message}</p> : null}
      {error ? <p style={{ color: "#c92a2a" }}>{error}</p> : null}
    </>
  );
};

export default BazarGuessingSetting;
