const app = require("./app");
const { port } = require("./config/env");
const { sequelize } = require("./models");
const ensureSessionColumn = require("./utils/ensureSessionColumn");

async function connectWithRetry() {
  let retries = 5;

  while (retries) {
    try {
      await sequelize.authenticate();
      await ensureSessionColumn(sequelize);
      console.log("DB Connected");
      return;
    } catch (error) {
      console.error(`DB connection failed. Retries left: ${retries}`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  console.error("Could not connect to DB after retries");
  process.exit(1);
}

async function startServer() {
  try {
    await connectWithRetry();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
