const {
  getResults,
  getTodayResults,
  getBazarVisibility,
} = require("../services/result.service");

async function listResultsController(req, res) {
  try {
    const data = await getResults({
      bazarId: req.query.bazarId,
      resultType: req.query.resultType,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      date: req.query.date,
    });
    return res.json(data);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function todayResultsController(req, res) {
  try {
    const data = await getTodayResults();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function bazarVisibilityController(req, res) {
  try {
    const bazar = await getBazarVisibility(req.params.bazarId);
    if (!bazar) {
      return res.status(404).json({ message: "Bazar not found" });
    }
    return res.json(bazar);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  listResultsController,
  todayResultsController,
  bazarVisibilityController,
};
