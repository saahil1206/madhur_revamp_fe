import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameSeoList = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [siteId, setSiteId] = useState("1");
  const [sites, setSites] = useState([{ id: 1, name: "madhurbazar.com" }]);
  const [bazarList, setBazarList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [editContext, setEditContext] = useState({ gameId: 0, pageName: "home" });
  const [form, setForm] = useState({
    metaHeader: "",
    pageTitle: "",
    subheading: "",
    pageHtml: "",
  });

  const token = localStorage.getItem("admin_token");

  const openModal = async (entry, pageName, titleText) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setModalTitle(titleText);
    setEditContext({ gameId: entry?.id || 0, pageName });
    setForm({ metaHeader: "", pageTitle: "", subheading: "", pageHtml: "" });
    setModalOpen(true);

    try {
      const params = new URLSearchParams();
      params.set("siteId", siteId);
      params.set("gameId", String(entry?.id || 0));
      params.set("pageName", pageName);
      const response = await fetch(`${apiBaseUrl}/api/seo/entry?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to load SEO");
      setForm({
        metaHeader: data.metaHeader || "",
        pageTitle: data.pageTitle || "",
        subheading: data.subheading || "",
        pageHtml: data.pageHtml || "",
      });
    } catch (_err) {}
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const pageList = [
    { label: "Home", key: "home" },
    { label: "About Us", key: "about-us" },
    { label: "Terms & Condition", key: "term-condition" },
    { label: "Privacy Policy", key: "privacy-policy" },
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

  const loadBaseData = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [siteRes, bazarRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/seo/sites`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBaseUrl}/api/bazar`),
      ]);
      const siteData = await siteRes.json();
      const bazarData = await bazarRes.json();
      if (siteRes.ok && Array.isArray(siteData) && siteData.length) {
        setSites(siteData);
        setSiteId(String(siteData[0].id));
      }
      if (bazarRes.ok && Array.isArray(bazarData)) {
        setBazarList(bazarData);
      }
    } catch (err) {
      setError("Failed to load SEO base data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSeo = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setSaveLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/seo/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: Number(siteId),
          gameId: Number(editContext.gameId || 0),
          pageName: editContext.pageName,
          metaHeader: form.metaHeader,
          pageTitle: form.pageTitle,
          subheading: form.subheading,
          pageHtml: form.pageHtml,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to save SEO");
      closeModal();
    } catch (_err) {
      setError("Failed to save SEO entry");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="record-top-bar">
        <h2 className="record-title">Game SEO List</h2>
        <div className="record-top-right">
          <div className="seo-site-select">
            <span>Select Site:</span>
            <select className="custom-input seo-select-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s, idx) => (
                <option key={`${s.id}-${idx}`} value={String(s.id)}>{s.name}</option>
              ))}
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
                <td>{name.bazar_name}</td>
                <td className="seo-action-btns">
                  <button className="seo-btn-purple" onClick={() => openModal(name, "jodi", "Edit SEO for Jodi page")}>Edit Jodi</button>
                  <button className="seo-btn-purple" onClick={() => openModal(name, "pana", "Edit SEO for Pana page")}>Edit Pana</button>
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
                <td>{page.label}</td>
                <td className="seo-action-btns">
                  <button className="action-edit" onClick={() => openModal({ id: 0 }, page.key, `Edit SEO for ${page.label}`)}>
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
                <textarea className="seo-form-input" rows={5} value={form.metaHeader} onChange={(e) => setForm((prev) => ({ ...prev, metaHeader: e.target.value }))} />
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Page Title</label>
                <input
                  type="text"
                  className="seo-form-input"
                  placeholder="Enter here"
                  value={form.pageTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, pageTitle: e.target.value }))}
                />
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Subheading</label>
                <input
                  type="text"
                  className="seo-form-input"
                  placeholder="Enter here"
                  value={form.subheading}
                  onChange={(e) => setForm((prev) => ({ ...prev, subheading: e.target.value }))}
                />
              </div>
              <div className="seo-form-group">
                <label className="seo-form-label">Page HTML</label>
                <textarea className="seo-form-input" rows={8} value={form.pageHtml} onChange={(e) => setForm((prev) => ({ ...prev, pageHtml: e.target.value }))} />
              </div>
            </div>
            <div className="seo-modal-footer">
              <button className="seo-modal-btn-back" onClick={closeModal}>
                Back
              </button>
              <button className="seo-modal-btn-save" onClick={saveSeo} disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p style={{ color: "#fff" }}>Loading...</p> : null}
      {error ? <p style={{ color: "#c92a2a" }}>{error}</p> : null}
    </>
  );
};

export default GameSeoList;
