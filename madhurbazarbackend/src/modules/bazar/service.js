const { GameBazar } = require("../../models");

function normalizeBazarType(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "elite" || text === "elite bazar") return "elite";
  if (text === "premium" || text === "premium bazar") return "premium";
  return "normal";
}

function withBazarType(row) {
  const data = row.toJSON ? row.toJSON() : row;
  return {
    ...data,
    bazar_type: normalizeBazarType(data.bazar_category),
  };
}

async function list(query = {}) {
  const limit = Number(query.limit || 200);
  const offset = Number(query.offset || 0);
  const onlyActive = query.active !== "0";
  const category = normalizeBazarType(query.category);

  const where = {};
  if (onlyActive) where.status = 1;
  if (query.category) where.bazar_category = category;

  const rows = await GameBazar.findAll({
    where,
    attributes: ["id", "bazar_name", "open_time", "close_time", "status", "bazar_category"],
    order: [["id", "ASC"]],
    limit,
    offset,
  });

  return rows.map(withBazarType);
}

async function getById(id) {
  const row = await GameBazar.findByPk(id, {
    attributes: ["id", "bazar_name", "open_time", "close_time", "status", "Notice", "bazar_category"],
  });
  if (!row) return null;
  return withBazarType(row);
}

async function create(payload) {
  const cleanPayload = { ...payload };
  if (payload?.bazar_type) {
    cleanPayload.bazar_category = normalizeBazarType(payload.bazar_type);
    delete cleanPayload.bazar_type;
  }
  const row = await GameBazar.create(cleanPayload);
  return withBazarType(row);
}

async function update(id, payload) {
  const row = await GameBazar.findByPk(id);
  if (!row) return null;
  const cleanPayload = { ...payload };
  if (payload?.bazar_type) {
    cleanPayload.bazar_category = normalizeBazarType(payload.bazar_type);
    delete cleanPayload.bazar_type;
  }
  await row.update(cleanPayload);
  return withBazarType(row);
}

async function remove(id) {
  const row = await GameBazar.findByPk(id);
  if (!row) return { deleted: false };
  await row.destroy();
  return { deleted: true };
}

module.exports = { list, getById, create, update, remove };
