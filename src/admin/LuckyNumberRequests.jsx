import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const LuckyNumberRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, limit: 50, offset: 0 });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const loadRequests = async (nextOffset = 0) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", String(pagination.limit));
      params.set("offset", String(nextOffset));
      const term = searchTerm.trim();
      if (term) params.set("search", term);

      const response = await fetch(`${apiBaseUrl}/api/lucky-number/requests?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load lucky number requests");
      }

      const items = Array.isArray(data?.items) ? data.items : [];
      const page = data?.pagination || {};
      setRows(items);
      setPagination({
        total: Number(page.total || 0),
        limit: Number(page.limit || pagination.limit),
        offset: Number(page.offset || nextOffset),
      });
    } catch (err) {
      setError(err.message || "Failed to load lucky number requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => String(row.mobile_number || "").toLowerCase().includes(term));
  }, [rows, searchTerm]);

  const handleSearch = () => {
    loadRequests(0);
  };

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 1)));
  const currentPage = Math.floor((pagination.offset || 0) / (pagination.limit || 1)) + 1;

  return (
    <>
      <div className="record-top-bar">
        <h2 className="record-title">Lucky Number Requests</h2>
        <div className="record-top-right">
          <div className="record-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search mobile"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <button className="btn-submit" type="button" onClick={handleSearch}>
            Search
          </button>
          <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {loading ? <p style={{ color: "#fff" }}>Loading requests...</p> : null}
      {error ? <p style={{ color: "#c92a2a" }}>{error}</p> : null}

      <div className="record-table-wrapper">
        <table className="record-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mobile Number</th>
              <th>Lucky Digit</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No records found.</td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.mobile_number}</td>
                  <td>{row.lucky_digit}</td>
                  <td>{row.created_at ? new Date(row.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <p style={{ color: "#fff", margin: 0 }}>
          Page {currentPage} of {totalPages} | Total: {pagination.total}
        </p>
        <div className="d-flex gap-2">
          <button
            className="btn-submit"
            type="button"
            disabled={pagination.offset <= 0 || loading}
            onClick={() => loadRequests(Math.max(0, pagination.offset - pagination.limit))}
          >
            Prev
          </button>
          <button
            className="btn-submit"
            type="button"
            disabled={pagination.offset + pagination.limit >= pagination.total || loading}
            onClick={() => loadRequests(pagination.offset + pagination.limit)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default LuckyNumberRequests;
