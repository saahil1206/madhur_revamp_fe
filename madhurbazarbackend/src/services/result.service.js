const { Op } = require("sequelize");
const { GameResult, GameBazar } = require("../models");

function indiaToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}


// function indiaToday() {
//   return new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).format(new Date("2026-03-28"));
// }

async function getResults({ bazarId, resultType, fromDate, toDate, date }) {
  const where = {};
  const today = indiaToday();

  if (date && !isIsoDate(date)) {
    throw badRequest("Invalid date format. Use YYYY-MM-DD.");
  }

  if (fromDate && !isIsoDate(fromDate)) {
    throw badRequest("Invalid fromDate format. Use YYYY-MM-DD.");
  }

  if (toDate && !isIsoDate(toDate)) {
    throw badRequest("Invalid toDate format. Use YYYY-MM-DD.");
  }

  if (fromDate && toDate && fromDate > toDate) {
    throw badRequest("From Date must be less than or equal to To Date.");
  }

  if ((date && date > today) || (fromDate && fromDate > today) || (toDate && toDate > today)) {
    throw badRequest("Future date is not allowed.");
  }

  if (bazarId) where.bazar_id = bazarId;
  if (resultType) where.result_type = resultType;
  if (date) where.result_date = date;
  if (fromDate && toDate) {
    where.result_date = { [Op.between]: [fromDate, toDate] };
  }

  return GameResult.findAll({
    where,
    include: [
      {
        model: GameBazar,
        as: "bazar",
        attributes: ["id", "bazar_name", "Notice", "bazar_category"],
        required: false,
      },
    ],
    order: [["result_date", "DESC"], ["id", "DESC"]],
  });
}

async function getTodayResults() {
  return getResults({ date: indiaToday() });
}

async function getBazarVisibility(bazarId) {
  const bazar = await GameBazar.findByPk(bazarId, {
    attributes: ["id", "bazar_name", "visiability", "status"],
  });
  return bazar;
}

module.exports = { getResults, getTodayResults, getBazarVisibility };
