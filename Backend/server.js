import app from "./app.js";
import { sequelize } from "./config/db.js";
import { PORT } from "./config/env.js";

async function start() {
  try {
    await sequelize.sync();
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
}

start();
