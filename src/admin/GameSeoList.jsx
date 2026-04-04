import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameSeoList = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (bazarName, type) => {
    setModalTitle(`Edit SEO for ${type} page`);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const bazarList = [
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
    "Dhanlaxmi morning",
    "Madhur Afternoon",
  ];

  const pageList = [
    "Home",
    "About Us",
    "Terms & Condition",
    "Privacy Policy",
  ];

  const defaultMetaHeader = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <h1>Hello, world!</h1>
    </body>
</html>`;

  const defaultPageHTML = `<!doctype html>
<html lang="en">
    <head>
        <h1>SEO for Jodi Page</h1>
    </head>
    <body>
        <p>Hello, world!</p>
    </body>
</html>`;

  return (
    <>
      {/* Top Bar */}
      <div className="record-top-bar">
        <h2 className="record-title">Game SEO List</h2>
        <div className="record-top-right">
          <div className="seo-site-select">
            <span>Select Site:</span>
            <select className="custom-input seo-select-input">
              <option>madhurbazar.com</option>
            </select>
          </div>
          <button className="btn-back-record" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {/* Bazar Table */}
      <div className="seo-table-wrapper">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Bazar Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bazarList.map((name, idx) => (
              <tr key={idx}>
                <td>{idx + 1}.</td>
                <td>{name}</td>
                <td className="seo-action-btns">
                  <button className="seo-btn-purple" onClick={() => openModal(name, "Jodi")}>Edit Jodi</button>
                  <button className="seo-btn-purple" onClick={() => openModal(name, "Pana")}>Edit Pana</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page Table */}
      <div className="seo-table-wrapper mt-4">
        <table className="seo-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Page</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageList.map((page, idx) => (
              <tr key={idx}>
                <td>{idx + 1}.</td>
                <td>{page}</td>
                <td className="seo-action-btns">
                  <button className="action-edit" onClick={() => openModal(page, page)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* SEO Edit Modal */}
      {modalOpen && (
        <div className="seo-modal-overlay" onClick={closeModal}>
          <div className="seo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="seo-modal-header">
              <h5 className="seo-modal-title">{modalTitle}</h5>
              <button className="seo-modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="seo-modal-body">
              <div className="seo-form-group">
                <label className="seo-form-label">Meta Header</label>
                <div
                  className="seo-form-code-box"
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: defaultMetaHeader.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>') }}
                ></div>
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Page Title</label>
                <input
                  type="text"
                  className="seo-form-input"
                  placeholder="Enter here"
                />
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Subheading</label>
                <input
                  type="text"
                  className="seo-form-input"
                  placeholder="Enter here"
                />
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Page HTML</label>
                <div
                  className="seo-form-code-box"
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: defaultPageHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>') }}
                ></div>
              </div>
            </div>
            <div className="seo-modal-footer">
              <button className="seo-modal-btn-back" onClick={closeModal}>
                Back
              </button>
              <button className="seo-modal-btn-save">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameSeoList;
