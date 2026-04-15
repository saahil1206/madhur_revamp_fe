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
