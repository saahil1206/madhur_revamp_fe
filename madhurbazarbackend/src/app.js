const express = require("express");
const cors = require("cors");
const { registerModuleRoutes } = require("./modules");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

app.use((err, req, res, next) => {
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ message: "Uploaded file is too large. Please use a smaller image." });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
