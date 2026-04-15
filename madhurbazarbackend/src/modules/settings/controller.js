const service = require("./service");

async function getFloating(req, res) {
  try {
    const data = await service.getFloatingSetting();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load floating setting" });
  }
}

async function updateFloating(req, res) {
  try {
    const data = await service.updateFloatingSetting(req.body || {});
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to update floating setting" });
  }
}

module.exports = { getFloating, updateFloating };
