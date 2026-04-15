const { Op } = require("sequelize");
const { GameResult, GameBazar } = require("../../models");

function computeAakda(numberText) {
  const digits = String(numberText || "").replace(/\D/g, "").split("");
  if (digits.length === 0) return null;
  const sum = digits.reduce((acc, d) => acc + Number(d), 0);
  return String(sum % 10);
}

function isValidPanna(numberText) {
  const value = String(numberText || "");
  if (!/^\d{3}$/.test(value)) return false;
  const [a, b, c] = value.split("").map(Number);
  const isTriple = a === b && b === c;
  const isAscendingConsecutive = b === a + 1 && c === b + 1;
  return isTriple || isAscendingConsecutive;
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
  if (!isValidPanna(number)) {
    throw new Error(
      "Invalid panna number. Use exactly 3 digits in ascending order (e.g. 123) or all same digits (e.g. 111)."
    );
  }

  const resultType = String(category).toLowerCase();
  if (!["open", "close"].includes(resultType)) {
    throw new Error("category must be open or close");
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
        "Invalid panna number. Use exactly 3 digits in ascending order (e.g. 123) or all same digits (e.g. 111)."
      );
    }
    updates.result_pana = String(updates.number);
    updates.result_AAkda = computeAakda(updates.number);
    delete updates.number;
  }
  if (updates.category) {
    updates.result_type = String(updates.category).toLowerCase();
    delete updates.category;
  }
  if (updates.bazar) {
    updates.bazar_id = updates.bazar;
    delete updates.bazar;
  }
  if (updates.date) {
    updates.result_date = updates.date;
    delete updates.date;
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
