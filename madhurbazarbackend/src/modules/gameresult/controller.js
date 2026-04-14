const service = require("./service");

async function list(req, res) {
  try {
    const data = await service.list(req.query);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getById(req, res) {
  try {
    const data = await service.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Result not found" });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function create(req, res) {
  try {
    const data = await service.create(req.body || {}, req.user || {});
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Bad request" });
  }
}

async function update(req, res) {
  try {
    const data = await service.update(req.params.id, req.body || {});
    if (!data) {
      return res.status(404).json({ message: "Result not found" });
    }
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Bad request" });
  }
}

async function remove(req, res) {
  try {
    const data = await service.remove(req.params.id);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list, getById, create, update, remove };
