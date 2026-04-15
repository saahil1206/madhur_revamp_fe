async function list(query = {}) {
  const limit = Number(query.limit || 50);
  const offset = Number(query.offset || 0);
  return { module: "adminmaster", items: [], pagination: { limit, offset }, note: "Legacy module scaffolded. Add business queries during migration." };
}

async function getById(id) {
  return { module: "adminmaster", id, note: "Legacy module scaffolded. Implement getById logic." };
}

async function create(payload) {
  return { module: "adminmaster", payload, note: "Legacy module scaffolded. Implement create logic." };
}

async function update(id, payload) {
  return { module: "adminmaster", id, payload, note: "Legacy module scaffolded. Implement update logic." };
}

async function remove(id) {
  return { module: "adminmaster", id, note: "Legacy module scaffolded. Implement delete logic." };
}

module.exports = { list, getById, create, update, remove };
