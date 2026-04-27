import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ALLOWED_PANNA_VALUES = new Set([
  "128", "129", "120", "130", "140", "123", "124", "125", "126", "127",
  "137", "138", "139", "149", "159", "150", "160", "134", "135", "136",
  "146", "147", "148", "158", "168", "169", "179", "170", "180", "145",
  "236", "156", "157", "167", "230", "178", "250", "189", "270", "190",
  "245", "237", "238", "239", "249", "240", "269", "260", "234", "280",
  "290", "246", "247", "248", "258", "259", "278", "279", "289", "235",
  "380", "345", "256", "257", "267", "268", "340", "350", "360", "370",
  "470", "390", "346", "347", "348", "349", "359", "369", "379", "389",
  "489", "480", "490", "356", "357", "358", "368", "378", "450", "460",
  "560", "570", "580", "590", "456", "367", "458", "459", "469", "479",
  "579", "589", "670", "680", "690", "457", "467", "468", "478", "569",
  "678", "679", "689", "789", "780", "790", "890", "567", "568", "578",
  "100", "200", "300", "400", "500", "600", "700", "800", "900", "550",
  "119", "110", "166", "112", "113", "114", "115", "116", "117", "118",
  "155", "228", "229", "220", "122", "277", "133", "224", "144", "226",
  "227", "255", "337", "266", "177", "330", "188", "233", "199", "244",
  "335", "336", "355", "338", "339", "448", "223", "288", "225", "299",
  "344", "499", "445", "446", "366", "466", "377", "440", "388", "334",
  "399", "660", "599", "455", "447", "556", "449", "477", "559", "488",
  "588", "688", "779", "699", "799", "880", "557", "558", "577", "668",
  "669", "778", "788", "770", "889", "899", "566", "990", "667", "677",
  "777", "444", "111", "888", "555", "222", "999", "666", "333", "000",
]);

function isValidPanna(value) {
  return /^\d{3}$/.test(value) && ALLOWED_PANNA_VALUES.has(value);
}

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
  const today = new Date().toISOString().slice(0, 10);

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

  const checkOpenResultExists = async (token) => {
    const params = new URLSearchParams();
    params.set("fromDate", visitDate);
    params.set("toDate", visitDate);
    params.set("bazarId", String(bazarId));
    params.set("category", "open");
    params.set("paginate", "false");

    const response = await fetch(
      `${apiBaseUrl}/api/gameresult?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Unable to verify open result.");
    }

    const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
    return rows.some(
      (row) =>
        String(row?.bazar?.id ?? row?.bazar ?? "") === String(bazarId) &&
        row?.result_type === "open" &&
        row?.result_date === visitDate,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!visitDate || !category || !bazarId || !number) {
      setError("All fields are required.");
      return;
    }
    if (visitDate > today) {
      setError("Future date is not allowed.");
      return;
    }
    if (!isValidPanna(String(number))) {
      setError("Invalid panna number. Please enter a valid panna from the approved chart.");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Session expired. Please login again.");
      navigate("/adminlogin");
      return;
    }

    setLoading(true);
    try {
      if (category === "close") {
        const hasOpenResult = await checkOpenResultExists(token);
        if (!hasOpenResult) {
          setError("Open result is not declared for this market on selected date. Please submit open result first.");
          setLoading(false);
          return;
        }
      }

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
          <div className="enter-result-card enter-result-purple">
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
                        max={today}
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
                      type="text"
                      className="custom-input"
                      placeholder="Enter 3-digit panna"
                      value={number}
                      inputMode="numeric"
                      maxLength={3}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 3);
                        setNumber(digitsOnly);
                      }}
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


