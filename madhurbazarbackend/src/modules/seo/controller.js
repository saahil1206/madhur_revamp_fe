const service = require("./service");

async function sites(req, res) {
  try {
    const data = await service.listSites();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load sites" });
  }
}

async function getEntry(req, res) {
  try {
    const data = await service.getSeoEntry({
      siteId: req.query.siteId,
      gameId: req.query.gameId,
      pageName: req.query.pageName,
    });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load SEO entry" });
  }
}

async function upsertEntry(req, res) {
  try {
    const data = await service.upsertSeoEntry({
      ...req.body,
      username: req.user?.username || "admin",
    });
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to save SEO entry" });
  }
}

module.exports = { sites, getEntry, upsertEntry };
