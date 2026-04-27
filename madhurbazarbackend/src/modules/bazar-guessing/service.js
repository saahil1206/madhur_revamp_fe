const { GameBazar, BazarGuessing } = require("../../models");

const DEFAULT_DIGITS = "1724";

function normalizeDigits(value) {
  if (Array.isArray(value)) {
    value = value.join("");
  }
  return String(value || "").replace(/\D/g, "").slice(0, 4);
}

function toDigitsArray(value) {
  const text = normalizeDigits(value).padEnd(4, "0").slice(0, 4);
  return text.split("").map((n) => Number(n));
}

async function ensureTable() {
  await BazarGuessing.sync();
}

async function list() {
  await ensureTable();

  const [bazars, rows] = await Promise.all([
    GameBazar.findAll({
      where: { status: 1 },
      attributes: ["id", "bazar_name"],
      order: [["id", "ASC"]],
    }),
    BazarGuessing.findAll({
      attributes: ["bazar_id", "guessing_digits"],
    }),
  ]);

  const guessingMap = new Map(rows.map((row) => [Number(row.bazar_id), row.guessing_digits]));

  return bazars.map((bazar) => {
    const digitsText = guessingMap.get(Number(bazar.id)) || DEFAULT_DIGITS;
    return {
      bazarId: bazar.id,
      name: bazar.bazar_name,
      digits: toDigitsArray(digitsText),
      digitsText: normalizeDigits(digitsText).padEnd(4, "0").slice(0, 4),
    };
  });
}

async function upsertBulk(payload = {}) {
  await ensureTable();

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) {
    throw new Error("items are required");
  }

  for (const item of items) {
    const bazarId = Number(item?.bazarId);
    const digits = normalizeDigits(item?.digits);

    if (!Number.isInteger(bazarId) || bazarId <= 0) {
      throw new Error("Invalid bazarId");
    }
    if (digits.length !== 4) {
      throw new Error("Each bazar guessing must have exactly 4 digits");
    }

    const existing = await BazarGuessing.findOne({ where: { bazar_id: bazarId } });
    if (existing) {
      await existing.update({ guessing_digits: digits });
    } else {
      await BazarGuessing.create({ bazar_id: bazarId, guessing_digits: digits });
    }
  }

  return list();
}

module.exports = { list, upsertBulk };
