const express = require("express");
const cors = require("cors");
const { registerModuleRoutes } = require("./modules");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok1" });
});

app.get("/api/version", (req, res) => {
  res.json({ version: "bazar-route-v1", time: "2026-04-02" });
});

app.get("/api/version2", (req, res) => {
  res.json({ version: "bazar-route-v1", time: "2026-04-02" });
});

registerModuleRoutes(app);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
