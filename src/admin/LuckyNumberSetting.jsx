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

const LuckyNumberSetting = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("admin_token");

  const [form, setForm] = useState({ aakda: "", pana: "", jodi: "", motor: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const panaPattern = /^\d{3}(?: \d{3}){3}$/;
  const jodiPattern = /^\d{2}(?: \d{2}){3}$/;

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/adminlogin");
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

  const sanitizeDigits = (value, allowSpaces = false) => {
    const cleanedValue = allowSpaces
      ? value.replace(/[^\d\s]/g, "").replace(/\s+/g, " ").trimStart()
      : value.replace(/\D/g, "");

    return cleanedValue;
  };

  const limitSpacedGroups = (value, groupSize, groupCount) => {
    const digitsOnly = String(value || "").replace(/\D/g, "").slice(0, groupSize * groupCount);
    return digitsOnly.replace(
      new RegExp(`(\\d{${groupSize}})(?=\\d)`, "g"),
      "$1 ",
    );
  };

  const getGroupedParts = (value) => String(value || "").trim().split(/\s+/).filter(Boolean);
  const getPanaGroups = (value) => getGroupedParts(value);

  const handleChange = (field, value, allowSpaces = false) => {
    const sanitizedValue = sanitizeDigits(value, allowSpaces);
    let nextValue = sanitizedValue;
    let nextError = "";

    if (field === "pana") {
      nextValue = limitSpacedGroups(sanitizedValue, 3, 4);
      const digitsOnly = sanitizedValue.replace(/\D/g, "");
      if (digitsOnly.length > 12) {
        nextError = "Pana must be in format 123 123 123 123.";
      } else if (sanitizedValue !== value) {
        nextError = "Pana can contain only digits and spaces.";
      } else if (getPanaGroups(nextValue).length === 4) {
        const groups = getPanaGroups(nextValue);
        const invalidGroup = groups.find((group) => !ALLOWED_PANNA_VALUES.has(group));
        if (invalidGroup) {
          nextError = `Pana group ${invalidGroup} is not allowed.`;
        } else if (new Set(groups).size !== 4) {
          nextError = "Pana pairs must not repeat.";
        }
      }
    } else if (field === "jodi") {
      nextValue = limitSpacedGroups(sanitizedValue, 2, 4);
      const digitsOnly = sanitizedValue.replace(/\D/g, "");
      if (digitsOnly.length > 8) {
        nextError = "Jodi must be in format 11 11 11 11.";
      } else if (sanitizedValue !== value) {
        nextError = "Jodi can contain only digits and spaces.";
      } else if (getGroupedParts(nextValue).length === 4 && new Set(getGroupedParts(nextValue)).size !== 4) {
        nextError = "Jodi pairs must not repeat.";
      }
    } else if (field === "motor" && sanitizedValue !== value) {
      nextError = "Motor can contain digits only.";
    } else if (field === "motor") {
      nextValue = sanitizedValue.slice(0, 10);
    } else if (field === "aakda" && sanitizedValue !== value) {
      nextError = "Aakda can contain digits only.";
    } else if (field === "aakda") {
      nextValue = sanitizedValue.slice(0, 4);
      if (nextValue.length === 4 && new Set(nextValue.split("")).size !== 4) {
        nextError = "Aakda digits must not repeat.";
      }
    }

    setForm((prev) => ({ ...prev, [field]: nextValue }));

    if (nextError) {
      setError(nextError);
      setMessage("");
    } else if (
      error === "Pana must be in format 123 123 123 123." ||
      error === "Pana can contain only digits and spaces." ||
      error === "Pana pairs must not repeat." ||
      error === "Jodi must be in format 11 11 11 11." ||
      error === "Jodi can contain only digits and spaces." ||
      error === "Jodi pairs must not repeat." ||
      error === "Motor can contain digits only." ||
      error === "Aakda can contain digits only."
    ) {
      setError("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    setMessage("");
    setError("");

    const trimmedForm = {
      aakda: form.aakda.trim(),
      pana: form.pana.trim(),
      jodi: form.jodi.trim(),
      motor: form.motor.trim(),
    };

    if (
      !trimmedForm.aakda ||
      !trimmedForm.pana ||
      !trimmedForm.jodi ||
      !trimmedForm.motor
    ) {
      setError("All lucky number fields are required.");
      return;
    }

    if (!/^\d+$/.test(trimmedForm.aakda)) {
      setError("Aakda must contain digits only.");
      return;
    }
    if (new Set(trimmedForm.aakda.split("")).size !== trimmedForm.aakda.length) {
      setError("Aakda digits must not repeat.");
      return;
    }

    if (!panaPattern.test(trimmedForm.pana)) {
      setError("Pana must be in format 123 123 123 123.");
      return;
    }
    const panaGroups = getPanaGroups(trimmedForm.pana);
    const invalidPanaGroup = panaGroups.find((group) => !ALLOWED_PANNA_VALUES.has(group));
    if (invalidPanaGroup) {
      setError(`Pana group ${invalidPanaGroup} is not allowed.`);
      return;
    }
    if (new Set(panaGroups).size !== 4) {
      setError("Pana pairs must not repeat.");
      return;
    }

    if (!jodiPattern.test(trimmedForm.jodi)) {
      setError("Jodi must be in format 11 11 11 11.");
      return;
    }
    if (new Set(getGroupedParts(trimmedForm.jodi)).size !== 4) {
      setError("Jodi pairs must not repeat.");
      return;
    }

    if (!/^\d+$/.test(trimmedForm.motor)) {
      setError("Motor must contain digits only.");
      return;
    }
    if (trimmedForm.motor.length < 4 || trimmedForm.motor.length > 10) {
      setError("Motor must be between 4 and 10 digits.");
      return;
    }
    if (new Set(trimmedForm.motor.split("")).size !== trimmedForm.motor.length) {
      setError("Motor digits must not repeat.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/lucky-number/latest`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trimmedForm),
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
              inputMode="numeric"
              maxLength={4}
              onChange={(e) => handleChange("aakda", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Pana</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 123 456 789 012"
              value={form.pana}
              inputMode="numeric"
              onChange={(e) => handleChange("pana", e.target.value, true)}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label-custom">Jodi</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 12 34 56 78"
              value={form.jodi}
              inputMode="numeric"
              onChange={(e) => handleChange("jodi", e.target.value, true)}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label-custom">Motor</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. 42"
              value={form.motor}
              inputMode="numeric"
              maxLength={10}
              onChange={(e) => handleChange("motor", e.target.value)}
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
