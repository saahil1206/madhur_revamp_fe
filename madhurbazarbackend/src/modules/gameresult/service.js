const { Op } = require("sequelize");
const { GameResult, GameBazar } = require("../../models");

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

function computeAakda(numberText) {
  const digits = String(numberText || "").replace(/\D/g, "").split("");
  if (digits.length === 0) return null;
  const sum = digits.reduce((acc, d) => acc + Number(d), 0);
  return String(sum % 10);
}

function isValidPanna(numberText) {
  const value = String(numberText || "");
  return /^\d{3}$/.test(value) && ALLOWED_PANNA_VALUES.has(value);
}

function addMinutes(dateObj, minutes) {
  const date = new Date(dateObj);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

function formatDateTime(dateObj) {
  const pad = (v) => String(v).padStart(2, "0");
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
    dateObj.getDate()
  )} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(
    dateObj.getSeconds()
  )}`;
}

async function list(query = {}) {
  const hasPage = query.page !== undefined;
  const hasLimit = query.limit !== undefined;
  const shouldPaginate = query.paginate === "true" || query.paginate === "1" || hasPage || hasLimit;
  const parsedPage = Number(query.page || 1);
  const parsedLimit = Number(query.limit || 20);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20;
  const offset = (page - 1) * limit;
  const where = {};

  if (query.fromDate && query.toDate) {
    where.result_date = { [Op.between]: [query.fromDate, query.toDate] };
  } else if (query.date) {
    where.result_date = query.date;
  }
  if (query.bazarId && query.bazarId !== "SelectAll") {
    where.bazar_id = query.bazarId;
  }
  if (query.category && query.category !== "SelectAll") {
    where.result_type = String(query.category).toLowerCase();
  }

  const include = [
    {
      model: GameBazar,
      as: "bazar",
      attributes: ["id", "bazar_name", "open_time", "close_time"],
      required: false,
    },
  ];
  const order = [["result_date", "DESC"], ["id", "DESC"]];

  if (!shouldPaginate) {
    return GameResult.findAll({
      where,
      include,
      order,
    });
  }

  const { rows, count } = await GameResult.findAndCountAll({
    where,
    include,
    order,
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    },
  };
}

async function getById(id) {
  return GameResult.findByPk(id, {
    include: [
      {
        model: GameBazar,
        as: "bazar",
        attributes: ["id", "bazar_name", "open_time", "close_time"],
        required: false,
      },
    ],
  });
}

async function create(payload, actor = {}) {
  const { date, number, bazar, category } = payload;
  if (!date || !number || !bazar || !category) {
    throw new Error("date, number, bazar and category are required");
  }
  if (String(date) > new Date().toISOString().slice(0, 10)) {
    throw new Error("Future date is not allowed.");
  }
  if (!isValidPanna(number)) {
    throw new Error(
      "Invalid panna number. Please enter a valid panna from the approved chart."
    );
  }

  const resultType = String(category).toLowerCase();
  if (!["open", "close"].includes(resultType)) {
    throw new Error("category must be open or close");
  }

  if (resultType === "close") {
    const openResult = await GameResult.findOne({
      where: { bazar_id: bazar, result_type: "open", result_date: date },
    });
    if (!openResult) {
      throw new Error(
        "Open result is not declared for this market on selected date. Please submit open result first."
      );
    }
  }

  const existing = await GameResult.findOne({
    where: { bazar_id: bazar, result_type: resultType, result_date: date },
  });
  if (existing) {
    throw new Error("Result already exists for selected bazar/category/date");
  }

  const now = new Date();
  const afterTime = formatDateTime(addMinutes(now, 30));
  const showtimeDate = new Date(date);
  showtimeDate.setDate(showtimeDate.getDate() + 1);
  showtimeDate.setHours(10, 0, 0, 0);

  const created = await GameResult.create({
    bazar_id: bazar,
    result_type: resultType,
    result_pana: String(number),
    result_AAkda: computeAakda(number),
    result_date: date,
    after_time: afterTime,
    showtime: formatDateTime(showtimeDate),
    createdby: actor.username || "admin",
  });

  await GameBazar.update(
    { visiability: 0 },
    {
      where: {
        id: { [Op.ne]: bazar },
      },
    }
  );
  await GameBazar.update({ visiability: 1 }, { where: { id: bazar } });

  return created;
}

async function update(id, payload) {
  const row = await GameResult.findByPk(id);
  if (!row) return null;

  const updates = { ...payload };
  if (updates.number) {
    if (!isValidPanna(updates.number)) {
      throw new Error(
        "Invalid panna number. Please enter a valid panna from the approved chart."
      );
    }
    updates.result_pana = String(updates.number);
    updates.result_AAkda = computeAakda(updates.number);
    delete updates.number;
  }
  if (updates.category) {
    updates.result_type = String(updates.category).toLowerCase();
    if (!["open", "close"].includes(updates.result_type)) {
      throw new Error("category must be open or close");
    }
    delete updates.category;
  }
  if (updates.bazar) {
    updates.bazar_id = updates.bazar;
    delete updates.bazar;
  }
  if (updates.date) {
    if (String(updates.date) > new Date().toISOString().slice(0, 10)) {
      throw new Error("Future date is not allowed.");
    }
    updates.result_date = updates.date;
    delete updates.date;
  }

  const nextResultType = updates.result_type || row.result_type;
  const nextBazarId = updates.bazar_id || row.bazar_id;
  const nextDate = updates.result_date || row.result_date;

  if (nextResultType === "close") {
    const openResult = await GameResult.findOne({
      where: {
        bazar_id: nextBazarId,
        result_type: "open",
        result_date: nextDate,
      },
    });
    if (!openResult) {
      throw new Error(
        "Open result is not declared for this market on selected date. Please submit open result first."
      );
    }
  }

  await row.update(updates);
  return row;
}

async function remove(id) {
  const row = await GameResult.findByPk(id);
  if (!row) return { deleted: false };
  await row.destroy();
  return { deleted: true };
}

module.exports = { list, getById, create, update, remove };

