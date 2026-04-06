import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/common/ChatBox";
import Footer from "../components/layout/Footer";
import akadaImg from "../assets/images/akada.png";
import panaImg from "../assets/images/pana.png";
import jodiImg from "../assets/images/jodi.png";
import motorImg from "../assets/images/motor.png";
import horoscopeMainImg from "../assets/images/Todays-Horoscope.png";
import horoscopeIcon from "../assets/images/Horoscope.png";
import { applySeoFromMetaHeader } from "../utils/applySeoFromMetaHeader";

const cardVariants = [
  "default",
  "default",
  "yellow",
  "default",
  "default",
  "blue",
];

const luckyCards = [
  { img: akadaImg, title: "Aakda", numbers: [1, 1, 1, 1] },
  { img: panaImg, title: "PANA", numbers: [1, 1, 1, 1] },
  { img: jodiImg, title: "Jodi", numbers: [1, 1, 1, 1] },
  { img: motorImg, title: "Motor", numbers: [1, 1, 1, 1] },
];

function formatApiTime(value) {
  if (!value) return "--";
  const [hStr, mStr] = String(value).split(":");
  const hour = Number(hStr);
  const minute = Number(mStr || 0);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return String(value);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${String(h12).padStart(2, "0")}.${String(minute).padStart(2, "0")} ${ampm}`;
}

function formatResultDigits(openPana, openAakda, closeAakda, closePana) {
  const text = `${openPana ?? "---"}-${openAakda ?? "-"}${closeAakda ?? "-"}-${closePana ?? "---"}`;
  return text.split("");
}

function combineDateAndTime(baseDate, timeValue) {
  if (!timeValue) return null;
  const [h, m, s] = String(timeValue)
    .split(":")
    .map((v) => Number(v || 0));
  if ([h, m, s].some(Number.isNaN)) return null;
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    h,
    m,
    s,
  );
}

function getOperationalDate(now) {
  const base = new Date(now);
  if (base.getHours() < 1) {
    base.setDate(base.getDate() - 1);
  }
  return new Date(base.getFullYear(), base.getMonth(), base.getDate());
}

function getCountdownPhase(now, openTime, closeTime) {
  const opDate = getOperationalDate(now);
  const openAt = combineDateAndTime(opDate, openTime);
  let closeAt = combineDateAndTime(opDate, closeTime);
  if (!openAt || !closeAt) return null;

  if (closeAt <= openAt) {
    closeAt.setDate(closeAt.getDate() + 1);
  }

  if (now < openAt) {
    return { phase: "Open", target: openAt };
  }

  if (now < closeAt) {
    return { phase: "Close", target: closeAt };
  }

  const nextOpen = new Date(openAt);
  nextOpen.setDate(nextOpen.getDate() + 1);
  return { phase: "Open", target: nextOpen };
}

function formatYmd(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(dateObj, days) {
  const d = new Date(dateObj);
  d.setDate(d.getDate() + days);
  return d;
}

function ResultCard({ title, variant, timer, digits, badgeText }) {
  const bodyClass =
    variant === "yellow"
      ? "result-card-body yellow-bg"
      : variant === "blue"
        ? "result-card-body blue-bg"
        : "result-card-body";
  const timerBoxClass =
    variant === "yellow"
      ? "timer-box-yellow"
      : variant === "blue"
        ? "timer-box-blue"
        : "timer-box";

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 mt-2 mb-3">
      <div className="result-card">
        <div className="result-card-header">
          <h6 className="mb-0 Poppins-SemiBold text-white">{title}</h6>
          <span className="live-badge Poppins-SemiBold">
            {badgeText || "Live"} <span className="live-dot"></span>
          </span>
        </div>
        <div className={bodyClass}>
          <div className="timer-section">
            <div>
              <div className="timer-item">
                <div className={timerBoxClass}>
                  <span className="timer-value Poppins-SemiBold">
                    {timer.hr}
                  </span>
                </div>
                <span className="timer-label poppins-regular text-center">
                  Hr
                </span>
              </div>
            </div>
            <span className="timer-colon Poppins-SemiBold mt-4">:</span>
            <div className="timer-item">
              <div className={timerBoxClass}>
                <span className="timer-value Poppins-SemiBold">
                  {timer.min}
                </span>
              </div>
              <span className="timer-label poppins-regular">Min</span>
            </div>
            <span className="timer-colon Poppins-SemiBold mt-4">:</span>
            <div className="timer-item">
              <div className={timerBoxClass}>
                <span className="timer-value Poppins-SemiBold">
                  {timer.sec}
                </span>
              </div>
              <span className="timer-label poppins-regular">Sec</span>
            </div>
          </div>
          <div className="result-numbers">
            {digits.map((d, i) => (
              <span
                key={i}
                className={
                  d === "-"
                    ? "result-dash Poppins-Medium"
                    : "result-digit Poppins-Medium"
                }
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [liveCards, setLiveCards] = useState([]);
  const [resultLoading, setResultLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${apiBaseUrl}/api/seoPublic?siteId=1&pageName=home&gameId=0`);
        const data = await res.json();
        applySeoFromMetaHeader(data?.metaHeader || "");
      } catch (_error) {}
    };
    loadSeo();
  }, []);

  useEffect(() => {
    const fetchUpcomingCards = async () => {
      setResultLoading(true);
      try {
        const now = new Date();
        const opDate = getOperationalDate(now);
        const currentDate = formatYmd(opDate);
        const prevDate = formatYmd(addDays(opDate, -1));

        const [bazarRes, resultRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/bazar`),
          fetch(
            `${apiBaseUrl}/api/results?fromDate=${prevDate}&toDate=${currentDate}`,
          ),
        ]);
        if (!bazarRes.ok || !resultRes.ok)
          throw new Error("Failed to load live results");

        const bazars = await bazarRes.json();
        const rangeResults = await resultRes.json();

        const byBazarDate = new Map();
        (Array.isArray(rangeResults) ? rangeResults : []).forEach((row) => {
          const key = `${row.bazar_id}-${row.result_date}`;
          const current = byBazarDate.get(key) || {
            openPana: "---",
            openAakda: "-",
            closeAakda: "-",
            closePana: "---",
          };
          if (row.result_type === "open") {
            current.openPana = row.result_pana ?? "---";
            current.openAakda = row.result_AAkda ?? "-";
          } else if (row.result_type === "close") {
            current.closeAakda = row.result_AAkda ?? "-";
            current.closePana = row.result_pana ?? "---";
          }
          byBazarDate.set(key, current);
        });

        const cards = (Array.isArray(bazars) ? bazars : [])
          .map((bazar, idx) => {
            const phaseData = getCountdownPhase(
              now,
              bazar.open_time,
              bazar.close_time,
            );
            if (!phaseData) return null;

            const todayParts =
              byBazarDate.get(`${bazar.id}-${currentDate}`) || null;
            const prevParts =
              byBazarDate.get(`${bazar.id}-${prevDate}`) || null;

            let parts = prevParts || {
              openPana: "---",
              openAakda: "-",
              closeAakda: "-",
              closePana: "---",
            };
            if (todayParts) {
              if (phaseData.phase === "Close") {
                parts = {
                  openPana: todayParts.openPana ?? "---",
                  openAakda: todayParts.openAakda ?? "-",
                  closeAakda: todayParts.closeAakda ?? "-",
                  closePana: todayParts.closePana ?? "---",
                };
              } else if (
                (todayParts.openPana ?? null) !== null ||
                (todayParts.openAakda ?? null) !== null
              ) {
                parts = todayParts;
              }
            }

            if (
              phaseData.phase === "Close" &&
              !todayParts?.closePana &&
              !todayParts?.closeAakda
            ) {
              parts = {
                openPana: todayParts?.openPana ?? parts.openPana,
                openAakda: todayParts?.openAakda ?? parts.openAakda,
                closeAakda: "-",
                closePana: "---",
              };
            }

            return {
              id: bazar.id,
              title: `${bazar.bazar_name} Result`,
              variant: cardVariants[idx % cardVariants.length],
              badgeText: phaseData.phase,
              targetTime: phaseData.target.toISOString(),
              digits: formatResultDigits(
                parts.openPana,
                parts.openAakda,
                parts.closeAakda,
                parts.closePana,
              ),
            };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(a.targetTime) - new Date(b.targetTime));

        setLiveCards(cards);
      } catch (error) {
        setLiveCards([]);
      } finally {
        setResultLoading(false);
      }
    };

    fetchUpcomingCards();
  }, [apiBaseUrl]);

  const cardsWithTimer = liveCards
    .map((card) => {
      const remaining = new Date(card.targetTime).getTime() - nowTick;
      if (remaining <= 0) return null;
      const totalSec = Math.floor(remaining / 1000);
      const hr = String(Math.floor(totalSec / 3600)).padStart(2, "0");
      const min = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
      const sec = String(totalSec % 60).padStart(2, "0");
      return { ...card, timer: { hr, min, sec } };
    })
    .filter(Boolean);

  useEffect(() => {
    const fetchTimeTable = async () => {
      setScheduleLoading(true);
      setScheduleError("");
      try {
        const response = await fetch(`${apiBaseUrl}/api/bazar`);
        if (!response.ok) throw new Error("Failed to load time table");
        const data = await response.json();
        const rows = Array.isArray(data)
          ? data.map((row) => ({
              name: row.bazar_name || "--",
              open: formatApiTime(row.open_time),
              close: formatApiTime(row.close_time),
            }))
          : [];
        setScheduleData(rows);
      } catch (err) {
        setScheduleError(err.message || "Failed to load time table");
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchTimeTable();
  }, [apiBaseUrl]);

  return (
    <>
      {/* Purple Bar */}
      <div className="Purple-bg mt-4">
        <div className="container py-4 mobile-p-1">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3">
              <h6 className="text-white Poppins-SemiBold mb-0">
                Dhamaka Guessing
              </h6>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7 col-7 mb-0">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">
                    Madhur Moring
                  </h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 purple-bar-hide">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">
                    Madhur Night
                  </h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12 mb-2 purple-bar-hide">
              <div className="d-flex justify-content-between maindiv-profile w-100">
                <div className="py-1">
                  <h5 className="mb-0 Poppins-SemiBold font-size-14">
                    Madhur Day
                  </h5>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {[1, 7, 2, 4].map((n, i) => (
                    <div key={i} className="purple-light-box">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-1 col-lg-1 col-sm-2 col-2 d-flex align-items-center justify-content-center">
              <div className="bg-volume">
                <i className="fas fa-volume-up text-white volume-iocn"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container">
        <h5 className="font-size-48 Poppins-Medium text-white text-center pt-5">
          Welcome To Madhur
        </h5>
        <h3 className="Poppins-Medium font-size-64 text-center text-white mt-4">
          India's<span className="poppins-bold"> No 1</span> Satta Market Site.
        </h3>
        <p className="Poppins-light text-center text-white">
          To get more regular updates stay connected
        </p>
        <div className="d-flex justify-content-center">
          <div className="telegram">
            <i className="fab fa-telegram-plane text-white font-20"></i>
          </div>
          <div className="whatup ms-4">
            <i className="fab fa-whatsapp text-white font-20"></i>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4 pb-4">
          <button className="btn bg-purple-btn">Guess Matka</button>
          <Link to="/results" className="btn outline-purple-btn ms-4">
            Check Results
          </Link>
        </div>
        <ChatBox />
      </div>

      {/* Result Cards Section */}
      <section className="section-bg pb-5">
        <div className="container-fluid pt-3">
          <div className="px-3 bg-gray minus-margin-top">
            <div className="row pt-2">
              {resultLoading && (
                <p className="text-white px-3 mb-3">
                  Loading upcoming results...
                </p>
              )}
              {!resultLoading && cardsWithTimer.length === 0 && (
                <p className="text-white px-3 mb-3">
                  No upcoming results for today.
                </p>
              )}
              {cardsWithTimer.map((card, i) => (
                <ResultCard key={i} {...card} />
              ))}
            </div>
          </div>
        </div>

        {/* Lucky Number Section */}
        <div className="container-fluid pt-5 pb-4">
          <h3 className="Poppins-SemiBold font-size-24 text-white text-center">
            Today Lucky Number
          </h3>
          <div className="row pt-4">
            {luckyCards.map((card, i) => (
              <div
                key={i}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-6 mb-2"
              >
                <div className="card p-4 card-back-color">
                  <div className="img-outer-div">
                    <img src={card.img} width="60%" alt={card.title} />
                  </div>
                  <h3 className="text-white mt-4">{card.title}</h3>
                  <div className="d-flex mt-3 mb-3">
                    {card.numbers.map((n, j) => (
                      <div
                        key={j}
                        className={`small-box ${j > 0 ? "ms-2" : ""}`}
                      >
                        <span className="Poppins-Medium font-size-16">{n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horoscope Section */}
        <div className="container background-img">
          <div className="row p-5 align-items-center">
            <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12 col-12 p-4">
              <img src={horoscopeMainImg} width="90%" alt="Today's Horoscope" />
            </div>
            <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
              <p className="text-white">
                The Spin to Win feature does not involve real money, real
                predictions, or guaranteed outcomes. All numbers generated
                through this tool are completely random and should be treated as
                fun results only. The purpose of Spin to Win is to add
                excitement and interaction to the platform while users explore
                Madhur Bazar content.
              </p>
              <h4 className="text-white">Today's Horoscope</h4>
              <img
                src={horoscopeIcon}
                className="mt-3 horoscope-img"
                width="10%"
                alt="Horoscope"
              />
              <p className="text-white mt-3">
                Today Libra may face a demanding and hectic schedule, requiring
                extra effort and discipline to manage tasks effectively. It is
                advisable to avoid major, impulsive decisions and focus on
                maintaining harmony in personal relationships.
              </p>
              <div className="mt-5 text-center">
                <button
                  className="btn purple-btn w-50"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Spin to win
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lucky Number Input */}
        <div className="container card-dark-bg mt-4 p-4">
          <div className="row Lavender-Purple pt-3 g-0 align-items-center justify-content-center">
            <h3 className="text-white text-center pt-4">
              Show today's Lucky Number!!!
            </h3>
            <div className="col-md-8 col-12 d-flex justify-content-center flex-column align-items-center">
              <div className="w-75">
                <input
                  className="input-style mt-4 w-100"
                  type="tel"
                  placeholder="Enter mobile number"
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>
              <p className="text-white mt-4 text-center Poppins-light font-size-14">
                Ut viverra nunc nec quam luctus, non pharetra nibh lacinia.
                Interdum et malesuada fames ac ante ipsum primis in faucibus.
              </p>
              <div className="mt-3 mb-5">
                <button className="btn purple-btn">Show Lucky Number</button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Table */}
        <div className="container card-dark-bg mt-4 p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <h4
              className="text-white poppins-bold mb-0"
              style={{ whiteSpace: "nowrap" }}
            >
              Time Table
            </h4>
            <p className="text-white Poppins-light font-size-14 mb-0">
              justo eros, maximus a velit ac, pulvinar faucibus sapien.
              Vestibulum quis sodales elit. Sed ornare eleifend vehicula. In hac
              habitasse plate
            </p>
          </div>
          <div className="table-responsive">
            <table className="time-table w-100">
              <thead>
                <tr>
                  <th>Game Bazaar</th>
                  <th>Open Time</th>
                  <th>Close Time</th>
                </tr>
              </thead>
              <tbody>
                {scheduleLoading && (
                  <tr>
                    <td colSpan="3" className="text-center text-white">
                      Loading...
                    </td>
                  </tr>
                )}
                {!scheduleLoading && scheduleError && (
                  <tr>
                    <td colSpan="3" className="text-center text-white">
                      {scheduleError}
                    </td>
                  </tr>
                )}
                {!scheduleLoading &&
                  !scheduleError &&
                  scheduleData.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-white">
                        No timetable data found.
                      </td>
                    </tr>
                  )}
                {scheduleData.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.open}</td>
                    <td>{row.close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
