const { LuckyNumber, LuckyNumberRequest } = require("../../models");
const { Op } = require("sequelize");

async function list(query = {}) {
  const limit = Number(query.limit || 1);
  const offset = Number(query.offset || 0);

  return LuckyNumber.findAll({
    attributes: ["id", "aakda", "pana", "jodi", "motor"],
    order: [["id", "DESC"]],
    limit,
    offset,
  });
}

async function getLatest() {
  const row = await LuckyNumber.findOne({
    attributes: ["id", "aakda", "pana", "jodi", "motor"],
    order: [["id", "DESC"]],
  });
  return row || { id: null, aakda: "", pana: "", jodi: "", motor: "" };
}

async function generate(body = {}) {
  const mobileNumber = String(body.mobileNumber || "").replace(/\D/g, "");
  if (mobileNumber.length !== 10) {
    throw new Error("Please provide a valid 10-digit mobile number");
  }

  const luckyDigit = Math.floor(Math.random() * 10);

  await LuckyNumberRequest.sync();
  const existing = await LuckyNumberRequest.findOne({
    where: { mobile_number: mobileNumber },
  });

  if (existing) {
    await existing.update({
      lucky_digit: luckyDigit,
      created_at: new Date(),
    });
  } else {
    await LuckyNumberRequest.create({
      mobile_number: mobileNumber,
      lucky_digit: luckyDigit,
    });
  }

  return {
    mobileNumber,
    luckyDigit,
  };
}

async function listRequests(query = {}) {
  const limit = Math.min(Math.max(Number(query.limit || 50), 1), 200);
  const offset = Math.max(Number(query.offset || 0), 0);
  const search = String(query.search || "").trim();

  const where = {};
  if (search) {
    where.mobile_number = { [Op.like]: `%${search}%` };
  }

  const { rows, count } = await LuckyNumberRequest.findAndCountAll({
    attributes: ["id", "mobile_number", "lucky_digit", "created_at"],
    where,
    order: [["id", "DESC"]],
    limit,
    offset,
  });

  return {
    items: rows,
    pagination: {
      total: count,
      limit,
      offset,
    },
  };
}

async function upsertLatest(body = {}) {
  const payload = {
    aakda: String(body.aakda || "").trim(),
    pana: String(body.pana || "").trim(),
    jodi: String(body.jodi || "").trim(),
    motor: String(body.motor || "").trim(),
  };

  const latest = await LuckyNumber.findOne({ order: [["id", "DESC"]] });
  if (latest) {
    await latest.update(payload);
    return latest;
  }

  return LuckyNumber.create(payload);
}

module.exports = { list, getLatest, upsertLatest, generate, listRequests };
