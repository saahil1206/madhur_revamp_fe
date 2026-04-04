import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterResult = () => {
  const navigate = useNavigate();
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("open");
  const [bazarId, setBazarId] = useState("");
  const [number, setNumber] = useState("");
  const [bazars, setBazars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const loadBazars = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/bazar`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setBazars(data);
          if (data[0]?.id) setBazarId(String(data[0].id));
        }
      } catch (_err) {
        setBazars([]);
      }
    };
    loadBazars();
  }, [apiBaseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!visitDate || !category || !bazarId || !number) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/gameresult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: visitDate,
          number: String(number),
          bazar: Number(bazarId),
          category,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit result.");
      }

      setMessage("Result submitted successfully.");
      setNumber("");
    } catch (err) {
      setError(err.message || "Failed to submit result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Enter Result Form */}
      <div className="row justify-content-center align-items-center">
        <div className="col-8">
          <div className="enter-result-card">
            <div className="enter-result-header">
              <h4>Enter Result</h4>
            </div>
            <div className="enter-result-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Visit Date</label>
                    <div className="custom-input-wrapper">
                      <input
                        type="date"
                        className="custom-input"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Category</label>
                    <select className="custom-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="open">Open</option>
                      <option value="close">Close</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Bazar</label>
                    <select className="custom-input" value={bazarId} onChange={(e) => setBazarId(e.target.value)}>
                      {bazars.map((bazar) => (
                        <option key={bazar.id} value={bazar.id}>
                          {bazar.bazar_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Number</label>
                    <input
                      type="number"
                      className="custom-input"
                      placeholder="Enter number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                </div>
                {message ? <p style={{ color: "#2f9e44", marginBottom: 12 }}>{message}</p> : null}
                {error ? <p style={{ color: "#c92a2a", marginBottom: 12 }}>{error}</p> : null}
                <div className="enter-result-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="admin-content">
        <div className="disclaimer-card">
          <h3>DISCLAIMER</h3>
          <p>
            View this website is on your own risk. All the information shown on
            website is sponsored and we warn you that is only for entertainment
            purpose... We respect all country rules/laws... if you not agree
            with our site. Please quit site right now.
          </p>
        </div>
      </div>
    </>
  );
};

export default EnterResult;
