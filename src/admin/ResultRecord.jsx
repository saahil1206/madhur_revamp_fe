import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultRecord = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [bazar, setBazar] = useState("SelectAll");
  const [category, setCategory] = useState("SelectAll");
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [bazars, setBazars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const token = localStorage.getItem("admin_token");

  const loadBazars = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/bazar`);
      const data = await response.json();
      setBazars(Array.isArray(data) ? data : []);
    } catch (_err) {
      setBazars([]);
    }
  };

  const loadResults = async (page = currentPage) => {
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("fromDate", fromDate);
      params.set("toDate", toDate);
      if (bazar !== "SelectAll") params.set("bazarId", bazar);
      if (category !== "SelectAll") params.set("category", category);
      params.set("paginate", "true");
      params.set("page", String(page));
      params.set("limit", String(pageSize));

      const response = await fetch(`${apiBaseUrl}/api/gameresult?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load records.");
      }
      if (Array.isArray(data)) {
        setRecords(data);
        setTotalRecords(data.length);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        const nextRecords = Array.isArray(data?.data) ? data.data : [];
        const pagination = data?.pagination || {};
        setRecords(nextRecords);
        setTotalRecords(Number(pagination.total || 0));
        setTotalPages(Number(pagination.totalPages || 1));
        setCurrentPage(Number(pagination.page || page));
      }
    } catch (err) {
      setError(err.message || "Failed to load records.");
      setRecords([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBazars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = (() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return records;
    return records.filter((rec) => {
      const bazarName = rec?.bazar?.bazar_name || "";
      const date = rec?.result_date || "";
      return (
        bazarName.toLowerCase().includes(term) ||
        String(rec?.result_pana || "").includes(term) ||
        String(rec?.result_AAkda || "").includes(term) ||
        String(date).toLowerCase().includes(term)
      );
    });
  })();

  const handleSearch = () => {
    if (fromDate > today || toDate > today) {
      setError("Future date is not allowed.");
      return;
    }
    if (fromDate > toDate) {
      setError("From Date must be less than or equal to To Date.");
      return;
    }
    if (currentPage !== 1) {
      setCurrentPage(1);
      loadResults(1);
      return;
    }
    loadResults(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadResults(page);
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/gameresult/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete");
      await loadResults();
    } catch (_err) {
      setError("Failed to delete result.");
    }
  };

  return (
    <>
      {/* Title + Search + Back */}
      <div className="record-top-bar">
        <h2 className="record-title">Result Record</h2>
        <div className="record-top-right">
          <div className="record-search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="record-filters">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label-custom">From Date</label>
            <input
              type="date"
              className="custom-input"
              value={fromDate}
              max={toDate > today ? today : toDate}
              onChange={(e) => {
                const value = e.target.value;
                setFromDate(value);
                if (toDate && value > toDate) setToDate(value);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">To Date</label>
            <input
              type="date"
              className="custom-input"
              value={toDate}
              min={fromDate}
              max={today}
              onChange={(e) => {
                const value = e.target.value;
                setToDate(value);
                if (fromDate && value < fromDate) setFromDate(value);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Bazar</label>
            <select className="custom-input" value={bazar} onChange={(e) => setBazar(e.target.value)}>
              <option value="SelectAll">SelectAll</option>
              {bazars.map((item) => (
                <option key={item.id} value={item.id}>{item.bazar_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Category</label>
            <select className="custom-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="SelectAll">SelectAll</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
          <div className="col-md-12 mt-2">
            <button className="btn-submit" type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      {loading ? <p style={{ color: "#141414" }}>Loading records...</p> : null}
      {error ? <p style={{ color: "#c92a2a" }}>{error}</p> : null}

      {/* Table */}
      <div className="record-table-wrapper">
        <table className="record-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bazar</th>
              <th>Category</th>
              <th>Pana No.</th>
              <th>Aakda</th>
              <th>Entry Time</th>
              <th>Crated By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No record found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec, idx) => (
                <tr key={idx}>
                  <td>{rec.result_date}</td>
                  <td>{rec?.bazar?.bazar_name || "-"}</td>
                  <td style={{ textTransform: "capitalize" }}>{rec.result_type}</td>
                  <td>{rec.result_pana}</td>
                  <td>{rec.result_AAkda}</td>
                  <td>{formatDateTime(rec.after_time)}</td>
                  <td>{rec.createdby || "-"}</td>
                  <td className="action-btns">
                    <button className="action-delete" onClick={() => handleDelete(rec.id)}><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
        <div style={{ color: "#181717", fontSize: "14px" }}>
          Total: {totalRecords} | Page {currentPage} of {totalPages}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-submit" type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1 || loading}>
            Previous
          </button>
          <button className="btn-submit" type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages || loading}>
            Next
          </button>
        </div>
      </div>

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

export default ResultRecord;
