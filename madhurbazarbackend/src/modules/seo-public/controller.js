const seoService = require("../seo/service");

async function getPublicSeo(req, res) {
  try {
    const data = await seoService.getSeoEntry({
      siteId: req.query.siteId || 1,
      gameId: req.query.gameId || 0,
      pageName: req.query.pageName || "home",
    });
    return res.json(data || {});
  } catch (error) {
    return res.status(500).json({ message: "Failed to load SEO data" });
  }
}

module.exports = { getPublicSeo };
