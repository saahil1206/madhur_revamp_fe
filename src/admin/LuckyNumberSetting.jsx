import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LuckyNumberSetting = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [form, setForm] = useState({ aakda: "", pana: "", jodi: "", motor: "" });
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
        const response = await fetch(`${apiBaseUrl}/api/lucky-number/latest`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to load lucky numbers");
        setForm({
          aakda: data?.aakda || "",
          pana: data?.pana || "",
          jodi: data?.jodi || "",
          motor: data?.motor || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load lucky numbers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiBaseUrl, navigate, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/lucky-number/latest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to save lucky numbers");

      setForm({
        aakda: data?.aakda || "",
        pana: data?.pana || "",
        jodi: data?.jodi || "",
        motor: data?.motor || "",
      });
      setMessage("Lucky numbers updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save lucky numbers");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="record-top-bar">
        <h2 className="record-title">Lucky Number Setting</h2>
        <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSave} className="record-filters">
        <div className="row">
          <div className="col-md-6">
            <label className="form-label-custom">Aakda</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 1234"
              value={form.aakda}
              onChange={(e) => setForm((p) => ({ ...p, aakda: e.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Pana</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 123 456 789 012"
              value={form.pana}
              onChange={(e) => setForm((p) => ({ ...p, pana: e.target.value }))}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label-custom">Jodi</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 12 34 56 78"
              value={form.jodi}
              onChange={(e) => setForm((p) => ({ ...p, jodi: e.target.value }))}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label-custom">Motor</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 42"
              value={form.motor}
              onChange={(e) => setForm((p) => ({ ...p, motor: e.target.value }))}
            />
          </div>
          <div className="col-md-12 mt-3">
            <button className="btn-submit" type="submit" disabled={saving || loading}>
              {saving ? "Saving..." : "Save Lucky Numbers"}
            </button>
          </div>
        </div>
      </form>

      {loading ? <p style={{ color: "#fff" }}>Loading...</p> : null}
      {message ? <p style={{ color: "#2f9e44" }}>{message}</p> : null}
      {error ? <p style={{ color: "#c92a2a" }}>{error}</p> : null}

      <div className="admin-content">
        <div className="disclaimer-card">
          <h3>DISCLAIMER</h3>
          <p>
            View this website is on your own risk. All the information shown on website is sponsored and we warn you
            that is only for entertainment purpose.
          </p>
        </div>
      </div>
    </>
  );
};

export default LuckyNumberSetting;
