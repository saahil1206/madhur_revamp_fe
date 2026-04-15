async function list(query = {}) {
  const limit = Number(query.limit || 50);
  const offset = Number(query.offset || 0);
  return { module: "adminaakda", items: [], pagination: { limit, offset }, note: "Legacy module scaffolded. Add business queries during migration." };
}

async function getById(id) {
  return { module: "adminaakda", id, note: "Legacy module scaffolded. Implement getById logic." };
}

async function create(payload) {
  return { module: "adminaakda", payload, note: "Legacy module scaffolded. Implement create logic." };
}

async function update(id, payload) {
  return { module: "adminaakda", id, payload, note: "Legacy module scaffolded. Implement update logic." };
}

async function remove(id) {
  return { module: "adminaakda", id, note: "Legacy module scaffolded. Implement delete logic." };
}

module.exports = { list, getById, create, update, remove };
