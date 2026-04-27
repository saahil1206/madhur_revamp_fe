import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = `${dateObj.getMonth() + 1}`.padStart(2, "0");
  const d = `${dateObj.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayDateKey() {
  const now = new Date();
  return formatDateKey(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  );
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatRangeLabel(startDate, endDate) {
  const startDay = `${startDate.getDate()}`.padStart(2, "0");
  const endDay = `${endDate.getDate()}`.padStart(2, "0");
  const monthShort = startDate.toLocaleString("en-US", { month: "short" });
  const yearShort = `${startDate.getFullYear()}`.slice(-2);
  return `${startDay}-${endDay} ${monthShort}, ${yearShort}`;
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStartOfWeekMonday(dateObj) {
  const date = new Date(dateObj);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getEndOfWeekSunday(dateObj) {
  const date = new Date(getStartOfWeekMonday(dateObj));
  date.setDate(date.getDate() + 6);
  return date;
}

function ResultCell({ left, jodi, right }) {
  return (
    <div className="rc">
      <span className="s">
        {left.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
      <span className="j">{jodi}</span>
      <span className="s">
        {right.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </div>
  );
}

function emptyCell() {
  return { left: ["-", "-", "-"], jodi: "--", right: ["-", "-", "-"] };
}

function normalizeCell(entry) {
  if (!entry) return emptyCell();

  const openPanaValue =
    entry.openPana === null ||
    entry.openPana === undefined ||
    entry.openPana === ""
      ? "---"
      : entry.openPana;
  const closePanaValue =
    entry.closePana === null ||
    entry.closePana === undefined ||
    entry.closePana === ""
      ? "---"
      : entry.closePana;

  const left = String(openPanaValue)
    .replace(/\s+/g, "")
    .slice(0, 3)
    .padEnd(3, "-")
    .split("");
  const right = String(closePanaValue)
    .replace(/\s+/g, "")
    .slice(0, 3)
    .padEnd(3, "-")
    .split("");

  const openAakdaRaw =
    entry.openAakda === null ||
    entry.openAakda === undefined ||
    entry.openAakda === ""
      ? "-"
      : entry.openAakda;
  const closeAakdaRaw =
    entry.closeAakda === null ||
    entry.closeAakda === undefined ||
    entry.closeAakda === ""
      ? "-"
      : entry.closeAakda;
  const openAakda = String(openAakdaRaw).replace(/\D/g, "").slice(0, 1) || "-";
  const closeAakda =
    String(closeAakdaRaw).replace(/\D/g, "").slice(0, 1) || "-";

  return {
    left,
    jodi: `${openAakda}${closeAakda}`,
    right,
  };
}

function CalendarPage() {
  const { gameSlug } = useParams();
  const gameName = gameSlug
    ? gameSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Calendar";

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const now = new Date();
  const todayKey = getTodayDateKey();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const defaultMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const defaultTo =
    formatDateKey(defaultMonthEnd) > todayKey ? now : defaultMonthEnd;

  const [year, setYear] = useState(String(now.getFullYear()));
  const [fromDate, setFromDate] = useState(formatDateKey(defaultFrom));
  const [toDate, setToDate] = useState(formatDateKey(defaultTo));
  const [bazars, setBazars] = useState([]);
  const [selectedBazarId, setSelectedBazarId] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const years = Array.from(
    { length: 7 },
    (_, index) => now.getFullYear() - index,
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const nextFrom = `${year}-01-01`;
    const nextTo = `${year}-12-31` > todayKey ? todayKey : `${year}-12-31`;
    setFromDate(nextFrom);
    setToDate(nextTo);
  }, [year, todayKey]);

  useEffect(() => {
    const fetchBazars = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/bazar?active=1&limit=200`,
        );
        if (!response.ok) throw new Error("Unable to fetch bazar list");
        const data = await response.json();
        const bazarList = Array.isArray(data)
          ? data
              .filter((row) => row?.id && row?.bazar_name)
              .map((row) => ({ id: row.id, name: row.bazar_name }))
          : [];
        setBazars(bazarList);

        if (gameSlug && bazarList.length > 0) {
          const wantedSlug = toSlug(gameSlug);
          const matched = bazarList.find((b) => toSlug(b.name) === wantedSlug);
          if (matched) {
            setSelectedBazarId(matched.id);
          } else {
            const partial = bazarList.find(
              (b) =>
                toSlug(b.name).includes(wantedSlug) ||
                wantedSlug.includes(toSlug(b.name)),
            );
            setSelectedBazarId(partial ? partial.id : bazarList[0].id);
          }
        } else if (bazarList.length > 0) {
          setSelectedBazarId(bazarList[0].id);
        }
      } catch (err) {
        setError(err.message || "Unable to fetch bazar list");
      }
    };

    fetchBazars();
  }, [apiBaseUrl, gameSlug]);

  const fetchPanelData = async () => {
    if (!selectedBazarId || !fromDate || !toDate) return;
    if (fromDate > toDate) {
      setError("From Date must be less than or equal to To Date.");
      setResults([]);
      return;
    }
    if (fromDate > todayKey || toDate > todayKey) {
      setError("Future date is not allowed.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const url = `${apiBaseUrl}/api/results?bazarId=${selectedBazarId}&fromDate=${fromDate}&toDate=${toDate}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Unable to fetch panel results");
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to fetch panel results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBazarId]);

  const weeklyRows = useMemo(() => {
    if (!fromDate || !toDate) return [];

    const byDate = new Map();
    results.forEach((row) => {
      const key = row.result_date;
      const current = byDate.get(key) || {
        openPana: "--",
        openAakda: "-",
        closeAakda: "-",
        closePana: "--",
      };
      if (row.result_type === "open") {
        current.openPana = row.result_pana ?? "--";
        current.openAakda = row.result_AAkda ?? "-";
      }
      if (row.result_type === "close") {
        current.closeAakda = row.result_AAkda ?? "-";
        current.closePana = row.result_pana ?? "--";
      }
      byDate.set(key, current);
    });

    const start = getStartOfWeekMonday(parseDateKey(fromDate));
    const end = getEndOfWeekSunday(parseDateKey(toDate));
    const rows = [];
    let cursor = new Date(start);

    while (cursor <= end) {
      const weekStart = new Date(cursor);
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const days = [];
      for (let i = 0; i < 7; i += 1) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const key = formatDateKey(day);
        if (key < fromDate || key > toDate) {
          days.push(emptyCell());
        } else {
          days.push(normalizeCell(byDate.get(key)));
        }
      }

      const row = {
        date: formatRangeLabel(weekStart, weekEnd),
        days,
      };

      const hasAnyData = days.some(
        (d) =>
          d.jodi !== "--" ||
          d.left.join("") !== "---" ||
          d.right.join("") !== "---",
      );
      if (hasAnyData) {
        rows.push(row);
      }

      cursor.setDate(cursor.getDate() + 7);
    }

    return rows.reverse();
  }, [results, fromDate, toDate]);

  const handleDownloadPdf = () => {
    if (weeklyRows.length === 0) return;

    const bazarName =
      bazars.find((b) => b.id === selectedBazarId)?.name || gameName;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 24;
    const tableTopGap = 16;
    const headerBandHeight = 30;
    const metaLineHeight = 14;
    const tableHeaderHeight = 24;
    const rowHeight = 52;
    const labels = ["Date", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const innerWidth = pageWidth - margin * 2;
    const dateColWidth = 98;
    const dayColWidth = (innerWidth - dateColWidth) / 7;
    const tableBottomLimit = pageHeight - margin;
    let y = margin;

    const drawReportHeader = () => {
      doc.setFillColor(89, 35, 109);
      doc.roundedRect(margin, y, innerWidth, headerBandHeight, 6, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Madhur Bazar Panel Chart", margin + 12, y + 20);
      y += headerBandHeight + 10;

      doc.setTextColor(35, 35, 35);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Game: ${gameName}`, margin, y);
      y += metaLineHeight;
      doc.text(`Bazar: ${bazarName}`, margin, y);
      y += metaLineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(`Date Range: ${fromDate} to ${toDate}`, margin, y);
      y += tableTopGap;
    };

    const drawTableHeader = () => {
      let x = margin;
      doc.setDrawColor(128, 128, 146);
      doc.setLineWidth(0.7);
      labels.forEach((label, idx) => {
        const w = idx === 0 ? dateColWidth : dayColWidth;
        doc.setFillColor(48, 48, 64);
        doc.rect(x, y, w, tableHeaderHeight, "FD");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(label, x + w / 2, y + 15, { align: "center" });
        x += w;
      });
      y += tableHeaderHeight;
    };

    const drawDayCell = (x, top, width, day) => {
      const left = day.left.join("");
      const right = day.right.join("");
      const jodi = day.jodi;
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(left, x + width / 2, top + 14, { align: "center" });
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(jodi, x + width / 2, top + 28, { align: "center" });
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(right, x + width / 2, top + 42, { align: "center" });
    };

    const ensureSpaceForRow = () => {
      if (y + rowHeight <= tableBottomLimit) return;
      doc.addPage();
      y = margin;
      drawReportHeader();
      drawTableHeader();
    };

    drawReportHeader();
    drawTableHeader();

    weeklyRows.forEach((row, rowIdx) => {
      ensureSpaceForRow();
      let x = margin;
      const fillShade = rowIdx % 2 === 0 ? [36, 36, 50] : [42, 42, 58];

      doc.setDrawColor(122, 122, 140);
      doc.setLineWidth(0.6);
      doc.setFillColor(fillShade[0], fillShade[1], fillShade[2]);

      doc.rect(x, y, dateColWidth, rowHeight, "FD");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(row.date, x + dateColWidth / 2, y + 28, { align: "center" });
      x += dateColWidth;

      row.days.forEach((day) => {
        doc.setFillColor(fillShade[0], fillShade[1], fillShade[2]);
        doc.rect(x, y, dayColWidth, rowHeight, "FD");
        drawDayCell(x, y, dayColWidth, day);
        x += dayColWidth;
      });

      y += rowHeight;
    });

    const safeName = `${bazarName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    doc.save(`${safeName || "madhur-bazar"}-panel-chart.pdf`);
  };

  return (
    <div className="container mt-4 pb-5">
      <div className="calendar-filter-bar">
        <div className="cal-sidebar">
          <div className="form-field">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <input
              type="date"
              value={fromDate}
              max={toDate > todayKey ? todayKey : toDate}
              onChange={(e) => {
                const value = e.target.value;
                setFromDate(value);
                if (toDate && value > toDate) setToDate(value);
              }}
            />
          </div>
          <div className="form-field">
            <input
              type="date"
              value={toDate}
              min={fromDate}
              max={todayKey}
              onChange={(e) => {
                const value = e.target.value;
                setToDate(value);
                if (fromDate && value < fromDate) setFromDate(value);
              }}
            />
          </div>
          <button className="btn-show-panel" onClick={fetchPanelData}>
            Show Panel
          </button>
          <button
            className="btn-download-pdf"
            onClick={handleDownloadPdf}
            disabled={weeklyRows.length === 0 || loading}
          >
            Download PDF <i className="fas fa-file-download"></i>
          </button>
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-left">
          {selectedBazarId && (
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <p className="text-white poppins-regular mb-0">
                {gameName} -{" "}
                {bazars.find((b) => b.id === selectedBazarId)?.name || ""}
              </p>
              <button
                className="btn-download-pdf"
                type="button"
                onClick={scrollToBottom}
              >
                Go To Bottom
              </button>
            </div>
          )}
          {loading && (
            <p className="text-white poppins-regular">Loading panel data...</p>
          )}
          {!loading && error && (
            <p className="text-danger poppins-regular">{error}</p>
          )}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="cal-table ">
                <thead>
                  <tr>
                    <th>Date's</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thus</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyRows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      {row.days.map((day, j) => (
                        <td key={j}>
                          <ResultCell {...day} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {weeklyRows.length > 0 && (
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn-show-panel"
                type="button"
                onClick={scrollToTop}
              >
                Go To Top
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
