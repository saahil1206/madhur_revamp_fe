import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BazarCategory() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [rows, setRows] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBazars = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/bazar?active=0`);
      if (!response.ok) throw new Error("Failed to load bazars");
      const data = await response.json();
      const normalized = (Array.isArray(data) ? data : []).map((item) => ({
        ...item,
        bazar_type: item?.bazar_type || "normal",
      }));
      setRows(normalized);
    } catch (err) {
      setRows([]);
      setError(err.message || "Failed to load bazars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBazars();
  }, []);

  const handleTypeChange = (id, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, bazar_type: value } : row)),
    );
  };

  const handleSave = async (id) => {
    setSavingId(id);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const row = rows.find((r) => r.id === id);
      const response = await fetch(`${apiBaseUrl}/api/bazar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bazar_type: row?.bazar_type || "normal" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Update failed");
      setMessage("Bazar category updated.");
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, bazar_type: data?.bazar_type || r.bazar_type } : r)),
      );
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="enter-result-card">
        <div className="enter-result-header">
          <h4>Bazar Category</h4>
        </div>
        <div className="enter-result-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0" style={{ color: "#5a3a6b" }}>
              Set each bazar as Normal, Elite, or Premium.
            </p>
            <button className="btn-submit" type="button" onClick={loadBazars}>
              Refresh
            </button>
          </div>

          {message ? <p style={{ color: "#2f9e44", marginBottom: 12 }}>{message}</p> : null}
          {error ? <p style={{ color: "#c92a2a", marginBottom: 12 }}>{error}</p> : null}

          {loading ? (
            <p>Loading bazars...</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bazar</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.bazar_name}</td>
                      <td>
                        <select
                          className="custom-input"
                          value={row.bazar_type}
                          onChange={(e) => handleTypeChange(row.id, e.target.value)}
                        >
                          <option value="normal">Normal Bazar</option>
                          <option value="elite">Elite Bazar</option>
                          <option value="premium">Premium Bazar</option>
                        </select>
                      </td>
                      <td>{Number(row.status) === 1 ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          className="btn-submit"
                          type="button"
                          onClick={() => handleSave(row.id)}
                          disabled={savingId === row.id}
                        >
                          {savingId === row.id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="enter-result-actions mt-3">
            <button type="button" className="btn-back" onClick={() => navigate("/dashboard")}>
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BazarCategory;

