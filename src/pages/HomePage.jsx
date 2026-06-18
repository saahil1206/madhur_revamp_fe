import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/common/ChatBox";
import Footer from "../components/layout/Footer";
import akadaImg from "../assets/images/akada.avif";
import panaImg from "../assets/images/pana.avif";
import jodiImg from "../assets/images/jodi.avif";
import motorImg from "../assets/images/motor.avif";
import horoscopeMainImg from "../assets/images/Todays-Horoscope.avif";
import horoscopeFallbackIcon from "../assets/images/Horoscope.avif";
import { applySeoFromMetaHeader } from "../utils/applySeoFromMetaHeader";
import { SITE_ID } from "../utils/siteId";

const SPIN_SEGMENT_DEG = 30;
const SPIN_DURATION_MS = 7600;

const spinHoroscopeBase = [
  { sign: "Aries", symbol: "♈" },
  { sign: "Taurus", symbol: "♉" },
  { sign: "Gemini", symbol: "♊" },
  { sign: "Cancer", symbol: "♋" },
  { sign: "Leo", symbol: "♌" },
  { sign: "Virgo", symbol: "♍" },
  { sign: "Libra", symbol: "♎" },
  { sign: "Scorpio", symbol: "♏" },
  { sign: "Sagittarius", symbol: "♐" },
  { sign: "Capricorn", symbol: "♑" },
  { sign: "Aquarius", symbol: "♒" },
  { sign: "Pisces", symbol: "♓" },
];

const horoscopeStartParts = [
  "can gain momentum by taking one focused step",
  "may feel steady progress in routine work",
  "may receive useful updates through conversations",
  "can benefit from strategic thinking and calm responses",
  "may discover practical solutions in unexpected places",
  "can make solid progress through disciplined effort",
  "may find clarity by balancing intuition and structure",
  "can shine by leading with patience instead of pressure",
];

const horoscopeActionParts = [
  "Keep communication clear and avoid impulsive reactions.",
  "Stay flexible and double-check details before final decisions.",
  "Prioritize consistency and avoid overcommitting your time.",
  "Use your focus wisely and avoid unnecessary confrontations.",
  "Protect your energy and stay grounded in practical steps.",
  "Balance confidence with listening for better results.",
  "Keep your plans simple and avoid perfection overload.",
  "Maintain harmony in relationships while handling key priorities.",
];

function hashToPositiveInt(value) {
  let hash = 0;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickWithSeed(items, seed) {
  if (!items.length) return "";
  return items[seed % items.length];
}

function buildHoroscopeMessage(sign, seed) {
  const sentenceOne = pickWithSeed(horoscopeStartParts, seed);
  const sentenceTwo = pickWithSeed(horoscopeActionParts, seed + 11);
  return `Today ${sign} ${sentenceOne}. ${sentenceTwo}`;
}

function getLocalYmd(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const horoscopeDateSeed = getLocalYmd();
const spinHoroscopeData = spinHoroscopeBase.map((item, index) => {
  const seed = hashToPositiveInt(`${horoscopeDateSeed}-${item.sign}-${index}`);
  return {
    ...item,
    message: buildHoroscopeMessage(item.sign, seed),
  };
});

const HOROSCOPE_SPIN_STORAGE_KEY = "madhur-horoscope-spin-date";

function normalizeBazarType(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "elite" || text === "elite bazar") return "elite";
  if (text === "premium" || text === "premium bazar") return "premium";
  return "normal";
}

function getVariantByBazarType(value) {
  const type = normalizeBazarType(value);
  if (type === "elite") return "yellow";
  if (type === "premium") return "blue";
  return "default";
}

const luckyCardsMeta = [
  { key: "aakda", img: akadaImg, title: "Aakda", digits: 4 },
  {
    key: "pana",
    img: panaImg,
    title: "PANA",
    digits: 3,
    grouped: true,
    boxCount: 4,
  },
  {
    key: "jodi",
    img: jodiImg,
    title: "Jodi",
    digits: 2,
    grouped: true,
    boxCount: 4,
  },
  {
    key: "motor",
    img: motorImg,
    title: "Motor",
    grouped: true,
    boxCount: 1,
    fullValue: true,
  },
];

function parseLuckyDigits(
  value,
  count = 4,
  grouped = false,
  boxCount = count,
  fullValue = false,
) {
  const raw = String(value ?? "").trim();
  const groups = raw
    .split(/[\s,|/]+/)
    .map((part) => part.replace(/\D/g, ""))
    .filter((part) => part.length > 0);

  if (grouped) {
    if (fullValue) {
      const first = groups[0] || "-";
      return [first];
    }
    const values = groups
      .map((group) => group.slice(0, count))
      .filter((group) => group.length === count)
      .slice(0, boxCount);
    while (values.length < boxCount) values.push("-".repeat(count));
    return values;
  }

  const flatDigits = raw.replace(/\D/g, "");
  const digits = flatDigits.slice(0, count).split("");
  while (digits.length < count) digits.push("-");
  return digits;
}

function getLuckyPlaceholder(card) {
  if (card.grouped) {
    if (card.fullValue) return ["-"];
    return Array(card.boxCount || 0).fill("-".repeat(card.digits || 1));
  }
  return Array(card.digits || 0).fill("-");
}

const zodiacBasePath = `${import.meta.env.BASE_URL}zodiac/`;

const zodiacImageBySign = {
  Aries: `${zodiacBasePath}aries.png`,
  Taurus: `${zodiacBasePath}taurus.png`,
  Gemini: `${zodiacBasePath}gemini.png`,
  Cancer: `${zodiacBasePath}cancer.png`,
  Leo: `${zodiacBasePath}leo.png`,
  Virgo: `${zodiacBasePath}virgo.png`,
  Libra: `${zodiacBasePath}libra.png`,
  Scorpio: `${zodiacBasePath}scorpio.png`,
  Sagittarius: `${zodiacBasePath}sagittarius.png`,
  Capricorn: `${zodiacBasePath}capricorn.png`,
  Aquarius: `${zodiacBasePath}aquarius.png`,
  Pisces: `${zodiacBasePath}pisces.png`,
};

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

function normalizeLink(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  if (/^https?:\/\//i.test(rawValue)) return rawValue;
  if (/^www\./i.test(rawValue)) return `https://${rawValue}`;
  return `https://${rawValue.replace(/^\/+/, "")}`;
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
  const defaultGuessingData = [
    { name: "Madhur Morning", numbers: [1, 7, 2, 4] },
    { name: "Madhur Night", numbers: [1, 7, 2, 4] },
    { name: "Madhur Day", numbers: [1, 7, 2, 4] },
  ];
  const [liveCards, setLiveCards] = useState([]);
  const [resultLoading, setResultLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const [luckyCards, setLuckyCards] = useState(
    luckyCardsMeta.map((card) => ({
      ...card,
      numbers: getLuckyPlaceholder(card),
    })),
  );
  const [luckyLoading, setLuckyLoading] = useState(true);
  const [mobileNumber, setMobileNumber] = useState("");
  const [luckyDigitResult, setLuckyDigitResult] = useState(null);
  const [luckySubmitLoading, setLuckySubmitLoading] = useState(false);
  const [luckySubmitError, setLuckySubmitError] = useState("");
  const [purpleBarData, setPurpleBarData] = useState([]);
  const [isSpeakingResults, setIsSpeakingResults] = useState(false);
  const [floatingSetting, setFloatingSetting] = useState({
    whatsappName: "Whatsapp",
    whatsappUrl: "",
    telegramName: "Telegram",
    telegramUrl: "",
    status: 0,
  });
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [nowTick, setNowTick] = useState(Date.now());
  const [spinRotation, setSpinRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(spinHoroscopeData[6]);
  const [showSpinReveal, setShowSpinReveal] = useState(false);
  const [spinCompletedToday, setSpinCompletedToday] = useState(false);
  const audioContextRef = useRef(null);
  const spinSoundTimerRef = useRef(null);
  const spinSoundStoppedRef = useRef(false);
  const speechTimeoutsRef = useRef([]);
  const [speechVoices, setSpeechVoices] = useState([]);
  const marqueeWrapperRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const list = window.speechSynthesis?.getVoices?.() || [];
      setSpeechVoices(list);
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    const storedSpinDate = window.localStorage.getItem(
      HOROSCOPE_SPIN_STORAGE_KEY,
    );
    setSpinCompletedToday(storedSpinDate === getLocalYmd());
  }, []);

  useEffect(() => {
    const fetchBazarGuessing = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/bazar-guessing`);
        if (!response.ok) throw new Error("Failed to load guessing");
        const data = await response.json();

        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          name: item?.name || "--",
          numbers: Array.isArray(item?.digits)
            ? item.digits.slice(0, 4)
            : [0, 0, 0, 0],
        }));
        setPurpleBarData(mapped);
      } catch (_error) {
        setPurpleBarData([
          { name: "Madhur Morning", numbers: [1, 7, 2, 4] },
          { name: "Madhur Night", numbers: [1, 7, 2, 4] },
          { name: "Madhur Day", numbers: [1, 7, 2, 4] },
        ]);
      }
    };
    fetchBazarGuessing();
  }, [apiBaseUrl]);

  useEffect(() => {
    const loadFloatingSetting = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/settings/floating-public`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to load floating setting");

        let parsedValue = {};
        if (data?.setting_value) {
          if (typeof data.setting_value === "object") {
            parsedValue = data.setting_value;
          } else {
            try {
              parsedValue = JSON.parse(data.setting_value);
            } catch (_error) {
              parsedValue = { whatsappUrl: data.setting_value };
            }
          }
        }

        setFloatingSetting({
          whatsappName: parsedValue.whatsappName || data?.setting_name || "Whatsapp",
          whatsappUrl: parsedValue.whatsappUrl || "",
          telegramName: parsedValue.telegramName || "Telegram",
          telegramUrl: parsedValue.telegramUrl || "",
          status: Number(data?.status) || 0,
        });
      } catch (_error) {
        setFloatingSetting({
          whatsappName: "Whatsapp",
          whatsappUrl: "https://wa.me/",
          telegramName: "Telegram",
          telegramUrl: "https://t.me/",
          status: 1,
        });
      }
    };

    loadFloatingSetting();
  }, [apiBaseUrl]);

  useEffect(() => {
    return () => {
      if (spinSoundTimerRef.current) {
        window.clearTimeout(spinSoundTimerRef.current);
      }
      speechTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      speechTimeoutsRef.current = [];
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiBaseUrl}/api/seoPublic?siteId=${SITE_ID}&pageName=home&gameId=0`,
        );
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
          .map((bazar) => {
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
              variant: getVariantByBazarType(
                bazar.bazar_category || bazar.bazar_type,
              ),
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

  const floatingEnabled = Number(floatingSetting.status) === 1;
  const floatingWhatsAppLink = normalizeLink(floatingSetting.whatsappUrl) || "https://wa.me/";
  const floatingTelegramLink = normalizeLink(floatingSetting.telegramUrl) || "https://t.me/";

  const stopSpinSound = () => {
    spinSoundStoppedRef.current = true;
    if (spinSoundTimerRef.current) {
      window.clearTimeout(spinSoundTimerRef.current);
      spinSoundTimerRef.current = null;
    }
  };

  const playTickSound = (ctx) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  };

  const startSpinSound = (durationMs) => {
    stopSpinSound();
    spinSoundStoppedRef.current = false;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const start = performance.now();
    const loopTick = () => {
      if (spinSoundStoppedRef.current) return;
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const intervalMs = 50 + progress * 170;

      playTickSound(ctx);

      if (progress >= 1) return;
      spinSoundTimerRef.current = window.setTimeout(loopTick, intervalMs);
    };

    loopTick();
  };

  const handleSpin = () => {
    if (isSpinning || spinCompletedToday) return;

    const randomIndex = Math.floor(Math.random() * spinHoroscopeData.length);
    const targetOffset =
      360 - randomIndex * SPIN_SEGMENT_DEG - SPIN_SEGMENT_DEG / 2;
    const nextRotation =
      Math.ceil(spinRotation / 360) * 360 + 5 * 360 + targetOffset;

    setIsSpinning(true);
    setSpinRotation(nextRotation);
    startSpinSound(SPIN_DURATION_MS);

    window.setTimeout(() => {
      const result = spinHoroscopeData[randomIndex];
      setSpinResult(result);
      setIsSpinning(false);
      setShowSpinReveal(true);
      setSpinCompletedToday(true);
      window.localStorage.setItem(HOROSCOPE_SPIN_STORAGE_KEY, getLocalYmd());
      stopSpinSound();

      window.setTimeout(() => {
        setShowSpinReveal(false);
      }, 2600);
    }, SPIN_DURATION_MS);
  };


  


  const spinButtonDisabled = isSpinning || spinCompletedToday;
  const spinButtonLabel = isSpinning
    ? "Spinning..."
    : spinCompletedToday
      ? "Come back tomorrow"
      : "Spin to win";

  const handleLuckyDigitSubmit = async () => {
    setLuckySubmitError("");
    setLuckyDigitResult(null);

    if (mobileNumber.length !== 10) {
      setLuckySubmitError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLuckySubmitLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/lucky-number/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to generate lucky number");
      }
      setLuckyDigitResult(data?.luckyDigit);
      setMobileNumber("");
    } catch (error) {
      setLuckySubmitError(error.message || "Failed to generate lucky number");
    } finally {
      setLuckySubmitLoading(false);
    }
  };

  useEffect(() => {
    const fetchLuckyNumbers = async () => {
      setLuckyLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/lucky-number?limit=1`);
        if (!response.ok) throw new Error("Failed to load lucky numbers");
        const data = await response.json();
        const row = Array.isArray(data) && data.length ? data[0] : {};

        const mapped = luckyCardsMeta.map((card) => ({
          ...card,
          numbers: parseLuckyDigits(
            row?.[card.key],
            card.digits,
            card.grouped,
            card.boxCount,
            card.fullValue,
          ),
        }));
        setLuckyCards(mapped);
      } catch (_error) {
        setLuckyCards(
          luckyCardsMeta.map((card) => ({
            ...card,
            numbers: getLuckyPlaceholder(card),
          })),
        );
      } finally {
        setLuckyLoading(false);
      }
    };

    fetchLuckyNumbers();
  }, [apiBaseUrl]);

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

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN"; // or "hi-IN"
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel(); // stop previous
    window.speechSynthesis.speak(speech);
  };

  const getPreferredFemaleVoice = () => {
    const voices = speechVoices || [];
    if (!voices.length) return null;

    const femaleHints = [
      "female",
      "woman",
      "zira",
      "susan",
      "samantha",
      "karen",
      "heera",
      "veena",
      "moira",
    ];
    const preferredLang = voices.find(
      (v) =>
        /^en(-|_)in$/i.test(v.lang || "") &&
        femaleHints.some((hint) => (v.name || "").toLowerCase().includes(hint)),
    );
    if (preferredLang) return preferredLang;

    const anyFemale = voices.find((v) =>
      femaleHints.some((hint) => (v.name || "").toLowerCase().includes(hint)),
    );
    return anyFemale || null;
  };

  const handleSpeakResults = () => {
    if (!("speechSynthesis" in window)) return;

    speechTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    speechTimeoutsRef.current = [];
    window.speechSynthesis.cancel();
    const speakItems = purpleBarData.length
      ? purpleBarData
      : defaultGuessingData;

    speakItems.forEach((item, index) => {
      const text = `${item.name} ${item.numbers.join(" ")}`;

      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-IN";
      speech.rate = 0.9; // more natural
      const femaleVoice = getPreferredFemaleVoice();
      if (femaleVoice) {
        speech.voice = femaleVoice;
      }

      if (index === speakItems.length - 1) {
        speech.onend = () => {
          setIsSpeakingResults(false);
        };
        speech.onerror = () => {
          setIsSpeakingResults(false);
        };
      }

      const timeoutId = window.setTimeout(() => {
        window.speechSynthesis.speak(speech);
      }, index * 2500);
      speechTimeoutsRef.current.push(timeoutId);
    });

    setIsSpeakingResults(true);
  };

  const stopSpeakResults = () => {
    if (!("speechSynthesis" in window)) return;

    speechTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    speechTimeoutsRef.current = [];
    window.speechSynthesis.cancel();
    setIsSpeakingResults(false);
  };

  const toggleSpeakResults = () => {
    if (isSpeakingResults || window.speechSynthesis?.speaking || window.speechSynthesis?.pending) {
      stopSpeakResults();
      return;
    }
    handleSpeakResults();
  };

  const unlockAudio = () => {
    const dummy = new SpeechSynthesisUtterance(" ");
    window.speechSynthesis.speak(dummy);
  };

  const handleMarqueeMouseDown = (e) => {
    const wrapper = marqueeWrapperRef.current;
    if (!wrapper) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = wrapper.scrollLeft;
    wrapper.style.cursor = "grabbing";
  };

  const handleMarqueeMouseMove = (e) => {
    const wrapper = marqueeWrapperRef.current;
    if (!wrapper || !isDraggingRef.current) return;
    const delta = e.pageX - dragStartXRef.current;
    wrapper.scrollLeft = dragStartScrollRef.current - delta;
  };

  const handleMarqueeMouseUp = () => {
    const wrapper = marqueeWrapperRef.current;
    isDraggingRef.current = false;
    if (wrapper) wrapper.style.cursor = "grab";
  };

  const handleMarqueeTouchStart = (e) => {
    const wrapper = marqueeWrapperRef.current;
    const touch = e.touches?.[0];
    if (!wrapper || !touch) return;
    isDraggingRef.current = true;
    dragStartXRef.current = touch.pageX;
    dragStartScrollRef.current = wrapper.scrollLeft;
  };

  const handleMarqueeTouchMove = (e) => {
    const wrapper = marqueeWrapperRef.current;
    const touch = e.touches?.[0];
    if (!wrapper || !touch || !isDraggingRef.current) return;
    const delta = touch.pageX - dragStartXRef.current;
    wrapper.scrollLeft = dragStartScrollRef.current - delta;
    e.preventDefault();
  };

  const handleMarqueeTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <>
      {/* Purple Bar */}
      <div className="Purple-bg mt-4">
        <div className="container py-4 mobile-p-1">
          <div className="d-flex align-items-center">
            <div className="purple-bar-label flex-shrink-0">
              <h6 className="text-white Poppins-SemiBold mb-0">
                Dhamaka Guessing
              </h6>
            </div>
            <div
              ref={marqueeWrapperRef}
              className="marquee-wrapper flex-grow-1 overflow-hidden"
              onMouseDown={handleMarqueeMouseDown}
              onMouseMove={handleMarqueeMouseMove}
              onMouseUp={handleMarqueeMouseUp}
              onMouseLeave={handleMarqueeMouseUp}
              onTouchStart={handleMarqueeTouchStart}
              onTouchMove={handleMarqueeTouchMove}
              onTouchEnd={handleMarqueeTouchEnd}
              onTouchCancel={handleMarqueeTouchEnd}
              style={{ cursor: "grab" }}
            >
              <div className="marquee-content">
                {[0, 1].map((copy) => (
                  <div key={copy} className="marquee-half">
                    {(purpleBarData.length
                      ? purpleBarData.map((item) => ({
                          name: item.name,
                          nums: item.numbers,
                        }))
                      : defaultGuessingData.map((item) => ({
                          name: item.name,
                          nums: item.numbers,
                        }))
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="marquee-item flex-shrink-0 mx-3"
                      >
                        <div className="d-flex align-items-center gap-3 maindiv-profile px-3">
                          <div className="py-1">
                            <h5 className="mb-0 Poppins-SemiBold font-size-14 text-nowrap">
                              {item.name}
                            </h5>
                          </div>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            {item.nums.map((n, i) => (
                              <div key={i} className="purple-light-box">
                                {n}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="flex-shrink-0 d-flex align-items-center justify-content-center ms-2">
              <div
                className="bg-volume"
                onClick={toggleSpeakResults}
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-volume-up text-white volume-iocn"></i>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container px-3 hero-section-container">
        <h5 className="font-size-48 Poppins-Medium text-white text-center pt-5">
          Welcome To Madhur
        </h5>
        <h3 className="Poppins-Medium font-size-64 text-center text-white mt-3 mt-md-4">
          India's<span className="poppins-bold"> No 1</span> Satta Market Site.
        </h3>
        <p className="Poppins-light text-center text-white font-size-14">
          To get more regular updates stay connected
        </p>
        <div className="d-flex justify-content-center gap-3">
          {floatingEnabled ? (
            <a
              className="telegram"
              href={floatingTelegramLink}
              target="_blank"
              rel="noreferrer"
              aria-label={floatingSetting.telegramName || "Telegram"}
            >
              <i className="fab fa-telegram-plane text-white font-20"></i>
            </a>
          ) : (
            <div className="telegram">
              <i className="fab fa-telegram-plane text-white font-20"></i>
            </div>
          )}
          {floatingEnabled ? (
            <a
              className="whatup"
              href={floatingWhatsAppLink}
              target="_blank"
              rel="noreferrer"
              aria-label={floatingSetting.whatsappName || "Whatsapp"}
            >
              <i className="fab fa-whatsapp text-white font-20"></i>
            </a>
          ) : (
            <div className="whatup">
              <i className="fab fa-whatsapp text-white font-20"></i>
            </div>
          )}
        </div>
        <div
          className="d-flex justify-content-center flex-wrap gap-2 gap-md-3 mt-3 mt-md-4 pb-4"
          style={{ position: "relative", zIndex: 2 }}
        >
	  {/* <button className="btn bg-purple-btn">Guess Matka</button>*/}
          <Link to="/results" className="btn outline-purple-btn">
            Check Results
          </Link>
        </div>
        <ChatBox />
      </div>

      {/* Result Cards Section */}
      <section className="section-bg pb-5">
        <div className="container pt-3 px-2 px-md-3">
          <div className="bg-gray minus-margin-top px-2 px-md-3">
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
        <div className="container pt-4 pt-md-5 pb-4 px-2 px-md-3">
          <h3 className="Poppins-SemiBold font-size-24 text-white text-center">
            Today Lucky Number
          </h3>
          <div className="row pt-3 pt-md-4 g-2 g-md-3">
            {luckyCards.map((card, i) => (
              <div key={i} className="col-6 col-md-6 col-lg-4 col-xl-3 mb-2">
                <div className="card p-2 p-md-4 card-back-color h-100">
                  <div className="img-outer-div">
                    <img src={card.img} width="60%" alt={card.title} />
                  </div>
                  <h3 className="text-white mt-2 mt-md-4">{card.title}</h3>
                  <div className="d-flex mt-3 mb-3 gap-2">
                    {(luckyLoading
                      ? getLuckyPlaceholder(card)
                      : card.numbers
                    ).map((n, j) => (
                      <div key={j} className="small-box">
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
          <div className="row p-2 p-md-4 p-lg-5 align-items-center">
            <div className="col-12 col-lg-5 p-2 p-md-4">
              <div className="spin-wheel-wrap">
                <span className="spin-pointer" aria-hidden="true"></span>
                <img
                  src={horoscopeMainImg}
                  width="90%"
                  alt="Today's Horoscope"
                  className="spin-wheel-img"
                  style={{ transform: `rotate(${spinRotation}deg)` }}
                />
                {showSpinReveal && (
                  <div className="spin-reveal Poppins-SemiBold">
                    You got: {spinResult.sign}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <p className="text-white font-size-14">
                The Spin to Win feature does not involve real money, real
                predictions, or guaranteed outcomes. All numbers generated
                through this tool are completely random and should be treated as
                fun results only. The purpose of Spin to Win is to add
                excitement and interaction to the platform while users explore
                Madhur Bazar content.
              </p>
              <h4 className="text-white">Today's Horoscope</h4>
              <div className="mt-3">
                <img
                  src={
                    zodiacImageBySign[spinResult.sign] || horoscopeFallbackIcon
                  }
                  className="zodiac-result-icon"
                  alt={spinResult.sign}
                  onError={(e) => {
                    e.currentTarget.src = horoscopeFallbackIcon;
                  }}
                />
              </div>
              <div className="mt-2">
                <p className="text-white mb-0 Poppins-SemiBold horoscope-sign-name">
                  {spinResult.sign}
                </p>
              </div>
              <p className="text-white mt-3">{spinResult.message}</p>
              <div className="mt-3 mt-md-5 text-center">
                <button
                  className="btn purple-btn w-100 w-md-50"
                  onClick={handleSpin}
                  disabled={spinButtonDisabled}
                >
                  {spinButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lucky Number Input */}
        <div className="container card-dark-bg mt-4 p-2 p-md-4">
          <div className="row Lavender-Purple pt-3 g-0 align-items-center justify-content-center p-2 p-md-3">
            <h3 className="text-white text-center pt-3 pt-md-4 font-size-24">
              Show today's Lucky Number!!!
            </h3>
            <div className="col-12 col-md-8 d-flex justify-content-center flex-column align-items-center">
              <div className="w-100 w-md-75 px-2 px-md-0">
                <input
                  className="input-style mt-4 w-100"
                  type="tel"
                  placeholder="Enter mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              {/* <p className="text-white mt-4 text-center Poppins-light font-size-14">
                Ut viverra nunc nec quam luctus, non pharetra nibh lacinia.
                Interdum et malesuada fames ac ante ipsum primis in faucibus.
              </p> */}
              <div className="mt-3 mb-5">
                <button
                  className="btn purple-btn"
                  onClick={handleLuckyDigitSubmit}
                  disabled={luckySubmitLoading}
                >
                  {luckySubmitLoading ? "Please wait..." : "Show Lucky Number"}
                </button>
              </div>
              {luckySubmitError && (
                <p className="text-danger text-center">{luckySubmitError}</p>
              )}
              {luckyDigitResult !== null && (
                <p className="text-white text-center Poppins-SemiBold">
                  Your lucky number is: {luckyDigitResult}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time Table */}
        <div className="container card-dark-bg mt-4 p-2 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3 mb-3">
            <h4 className="text-white poppins-bold mb-0">Time Table</h4>
            {/* <p className="text-white Poppins-light font-size-14 mb-0">
              justo eros, maximus a velit ac, pulvinar faucibus sapien.
              Vestibulum quis sodales elit. Sed ornare eleifend vehicula. In hac
              habitasse plate
            </p> */}
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

