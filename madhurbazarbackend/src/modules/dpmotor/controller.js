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
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function create(req, res) {
  try {
    const data = await service.create(req.body || {});
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function update(req, res) {
  try {
    const data = await service.update(req.params.id, req.body || {});
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
