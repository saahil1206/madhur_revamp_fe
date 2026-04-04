import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResultRecord = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const records = [
    { date: "02 April 2026", bazar: "Dhanlaxmi morning", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "03 April 2026", bazar: "Madhur Afternoon", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "02 April 2026", bazar: "Dhanlaxmi morning", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "03 April 2026", bazar: "Madhur Afternoon", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "02 April 2026", bazar: "Dhanlaxmi morning", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "03 April 2026", bazar: "Madhur Afternoon", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "02 April 2026", bazar: "Dhanlaxmi morning", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
    { date: "03 April 2026", bazar: "Madhur Afternoon", category: "Open", panaNo: 138, aakda: 2, entryTime: "02/04/2026 15:17:45", createdBy: "Akshay Nandgwade" },
  ];

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= 3; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      {/* Title + Search + Back */}
      <div className="record-top-bar">
        <h2 className="record-title">Result Record</h2>
        <div className="record-top-right">
          <div className="record-search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" />
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
            <input type="date" className="custom-input" defaultValue="2026-04-02" />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">To Date</label>
            <input type="date" className="custom-input" defaultValue="2026-04-03" />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Bazar</label>
            <select className="custom-input">
              <option>Madhur Morning</option>
              <option>Madhur Day</option>
              <option>Madhur Evening</option>
              <option>Madhur Night</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Category</label>
            <select className="custom-input">
              <option>Open</option>
              <option>Close</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="record-table-wrapper">
        <table className="record-table">
          <thead>
            <tr>
              <th>Date <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Bazar <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Category <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Pana No. <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Aakda <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Entry Time <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Crated By <span className="sort-icons"><i className="fas fa-caret-up"></i><i className="fas fa-caret-down"></i></span></th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={idx}>
                <td>{rec.date}</td>
                <td>{rec.bazar}</td>
                <td>{rec.category}</td>
                <td>{rec.panaNo}</td>
                <td>{rec.aakda}</td>
                <td>{rec.entryTime}</td>
                <td>{rec.createdBy}</td>
                <td className="action-btns">
                  <button className="action-edit"><i className="fas fa-edit"></i></button>
                  <button className="action-delete"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="record-pagination">
        <div className="pagination-left">
          <button className="page-btn" onClick={() => setCurrentPage(1)}><i className="fas fa-angle-double-left"></i></button>
          <button className="page-btn" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}><i className="fas fa-angle-left"></i></button>
          {renderPageNumbers()}
          <span className="page-dots">...</span>
          <button className="page-btn" onClick={() => setCurrentPage(10)}>10</button>
          <button className="page-btn" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}><i className="fas fa-angle-right"></i></button>
          <button className="page-btn" onClick={() => setCurrentPage(totalPages)}><i className="fas fa-angle-double-right"></i></button>
        </div>
        <div className="pagination-right">
          <span>Page</span>
          <select className="page-select" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <span>of {totalPages}</span>
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
