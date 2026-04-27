const service = require("./service");

async function list(req, res) {
  try {
    const data = await service.list();
    return res.json(data);
  } catch (_error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function upsertBulk(req, res) {
  try {
    const data = await service.upsertBulk(req.body || {});
    return res.json(data);
  } catch (error) {
    if (error?.message) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list, upsertBulk };
