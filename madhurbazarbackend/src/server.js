const app = require("./app");
const { port } = require("./config/env");
const { sequelize } = require("./models");

async function startServer() {
  try {
    await sequelize.authenticate();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
