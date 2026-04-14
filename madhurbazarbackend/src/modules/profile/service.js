async function list(query = {}) {
  const limit = Number(query.limit || 50);
  const offset = Number(query.offset || 0);
  return { module: "profile", items: [], pagination: { limit, offset }, note: "Legacy module scaffolded. Add business queries during migration." };
}

async function getById(id) {
  return { module: "profile", id, note: "Legacy module scaffolded. Implement getById logic." };
}

async function create(payload) {
  return { module: "profile", payload, note: "Legacy module scaffolded. Implement create logic." };
}

async function update(id, payload) {
  return { module: "profile", id, payload, note: "Legacy module scaffolded. Implement update logic." };
}

async function remove(id) {
  return { module: "profile", id, note: "Legacy module scaffolded. Implement delete logic." };
}

module.exports = { list, getById, create, update, remove };
