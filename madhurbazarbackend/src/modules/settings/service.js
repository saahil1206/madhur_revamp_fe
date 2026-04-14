const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");

async function getFloatingSetting() {
  const rows = await sequelize.query(
    "SELECT * FROM settings WHERE id = 1 LIMIT 1",
    { type: QueryTypes.SELECT }
  );

  if (!rows.length) {
    return {
      id: 1,
      setting_name: "Whatsapp",
      setting_value: "",
      status: 0,
    };
  }

  return rows[0];
}

async function updateFloatingSetting(payload) {
  const current = await getFloatingSetting();

  const next = {
    setting_name:
      payload.setting_name !== undefined
        ? String(payload.setting_name)
        : current.setting_name,
    setting_value:
      payload.setting_value !== undefined
        ? String(payload.setting_value)
        : current.setting_value,
    status:
      payload.status !== undefined ? Number(payload.status) : Number(current.status || 0),
  };

  const exists = await sequelize.query(
    "SELECT id FROM settings WHERE id = 1 LIMIT 1",
    { type: QueryTypes.SELECT }
  );

  if (exists.length) {
    await sequelize.query(
      "UPDATE settings SET setting_name = :setting_name, setting_value = :setting_value, status = :status WHERE id = 1",
      {
        type: QueryTypes.UPDATE,
        replacements: next,
      }
    );
  } else {
    await sequelize.query(
      "INSERT INTO settings (id, setting_name, setting_value, status) VALUES (1, :setting_name, :setting_value, :status)",
      {
        type: QueryTypes.INSERT,
        replacements: next,
      }
    );
  }

  return getFloatingSetting();
}

module.exports = { getFloatingSetting, updateFloatingSetting };
